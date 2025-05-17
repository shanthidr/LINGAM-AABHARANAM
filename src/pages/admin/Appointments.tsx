
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, Appointment, updateAppointmentStatus, deleteAppointment } from '@/services/appointmentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  Search,
  Calendar,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

const AdminAppointments = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Appointment['status']>('pending');
  
  const { toast } = useToast();

  // Use React Query for data fetching
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Appointment['status'] }) => 
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Status Updated',
        description: `The appointment status has been changed to ${newStatus}.`
      });
      setIsStatusDialogOpen(false);
      setSelectedAppointment(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update appointment status. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        toast({
          title: 'Appointment Deleted',
          description: 'The appointment has been cancelled and removed.'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the appointment.',
          variant: 'destructive',
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedAppointment(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete the appointment.',
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
    }
  });

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };
  
  // Open appointment details
  const viewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };
  
  // Open status change dialog
  const openStatusChangeDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setIsStatusDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedAppointment) return;
    statusMutation.mutate({ id: selectedAppointment.id, status: newStatus });
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!selectedAppointment) return;
    deleteMutation.mutate(selectedAppointment.id);
  };

  // Get status badge color
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'confirmed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Appointments Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell className="text-right"><div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.name}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {appointment.purpose.replace(/-/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(appointment.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => viewAppointmentDetails(appointment)}
                          className="cursor-pointer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusChangeDialog(appointment)}
                          className="cursor-pointer"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(appointment)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client Name</h3>
                  <p>{selectedAppointment.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p>{getStatusBadge(selectedAppointment.status)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${selectedAppointment.email}`} className="text-brand-gold hover:underline">
                    {selectedAppointment.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${selectedAppointment.phone}`} className="text-brand-gold hover:underline">
                    {selectedAppointment.phone}
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{formatDate(selectedAppointment.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time</h3>
                  <p>{selectedAppointment.time}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Purpose of Visit</h3>
                <p className="capitalize">{selectedAppointment.purpose.replace(/-/g, ' ')}</p>
              </div>
              
              {selectedAppointment.message && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                  <p className="text-sm">{selectedAppointment.message}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Booked On</h3>
                <p>{formatDate(selectedAppointment.createdAt)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => openStatusChangeDialog(selectedAppointment!)}
              className="bg-brand-gold hover:bg-brand-gold-dark"
            >
              Change Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Change the status of this appointment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Client: {selectedAppointment.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                </p>
                <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="confirmed">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Confirmed
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Cancelled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusChange}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Appointment Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div>
              <p><strong>Client:</strong> {selectedAppointment.name}</p>
              <p><strong>Date:</strong> {formatDate(selectedAppointment.date)} at {selectedAppointment.time}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Appointment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;
