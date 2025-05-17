
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Customer, getAllCustomers, deleteCustomer } from '@/services/customerService';
import { Mail, Phone, Calendar, Trash2, Search, UserRound, ShoppingBag, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  useEffect(() => {
    // Filter customers based on search query
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query))
      );
      setFilteredCustomers(filtered);
    }
    
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, customers]);
  
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      await deleteCustomer(selectedCustomer.id);
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer.id !== selectedCustomer.id)
      );
      toast({
        title: "Success",
        description: `${selectedCustomer.name} has been deleted.`,
      });
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const pageNumbers = [];
  const maxPageButtons = 5;
  const startPage = Math.max(1, Math.min(
    currentPage - Math.floor(maxPageButtons / 2),
    totalPages - maxPageButtons + 1
  ));
  
  for (
    let i = startPage;
    i <= Math.min(startPage + maxPageButtons - 1, totalPages);
    i++
  ) {
    pageNumbers.push(i);
  }
  
  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Manage your customer database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-10">
              <UserRound className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No customers yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                When customers register or make appointments, they will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Registered</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
                      <TableHead className="hidden lg:table-cell">Purchases</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.length > 0 ? (
                      paginatedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                <span className="hidden md:inline">{customer.email}</span>
                                <span className="md:hidden truncate max-w-[100px]">{customer.email}</span>
                              </div>
                              {customer.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Phone className="h-3 w-3" />
                                  <span>{customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(customer.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {customer.lastVisit ? formatDate(customer.lastVisit) : "Never"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <ShoppingBag className="h-3 w-3" />
                              <span>{customer.totalPurchases || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                            <h3 className="mt-2 text-base font-medium">No customers found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Try adjusting your search query
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCustomer?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
