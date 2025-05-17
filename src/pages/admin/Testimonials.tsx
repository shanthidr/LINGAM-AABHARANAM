
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllTestimonials,
  Testimonial,
  toggleTestimonialApproval,
  toggleHomepageDisplay,
  deleteTestimonial,
  clearAllTestimonials
} from '@/services/testimonialService';
import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { 
  Trash2,
  Star,
  StarHalf,
  Search,
  MoreVertical,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminTestimonials = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const { toast } = useToast();

  // Query testimonials
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials
  });

  // Mutations
  const approvalMutation = useMutation({
    mutationFn: toggleTestimonialApproval,
    onSuccess: (updated) => {
      if (updated) {
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        toast({
          title: updated.isApproved ? 'Testimonial Approved' : 'Testimonial Unapproved',
          description: `Testimonial by ${updated.customerName} has been ${updated.isApproved ? 'approved' : 'unapproved'}.`
        });
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update testimonial approval status.',
        variant: 'destructive',
      });
    }
  });

  const homepageMutation = useMutation({
    mutationFn: toggleHomepageDisplay,
    onSuccess: (updated) => {
      if (updated) {
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        toast({
          title: updated.showOnHomepage ? 'Added to Homepage' : 'Removed from Homepage',
          description: `Testimonial by ${updated.customerName} will ${updated.showOnHomepage ? 'now be shown' : 'no longer be shown'} on the homepage.`
        });
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update homepage display status.',
        variant: 'destructive',
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        toast({
          title: 'Testimonial Deleted',
          description: 'The testimonial has been deleted successfully.'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete testimonial.',
          variant: 'destructive',
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedTestimonial(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial.',
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
      setSelectedTestimonial(null);
    }
  });

  const clearAllMutation = useMutation({
    mutationFn: clearAllTestimonials,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        toast({
          title: 'All Testimonials Cleared',
          description: 'All testimonials have been removed.'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to clear testimonials.',
          variant: 'destructive',
        });
      }
      setIsClearAllDialogOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to clear testimonials.',
        variant: 'destructive',
      });
      setIsClearAllDialogOpen(false);
    }
  });

  const filteredTestimonials = testimonials.filter(
    testimonial => 
      testimonial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprovalToggle = (id: string) => {
    approvalMutation.mutate(id);
  };

  const handleHomepageToggle = (id: string) => {
    homepageMutation.mutate(id);
  };

  const confirmDelete = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedTestimonial) {
      deleteMutation.mutate(selectedTestimonial.id);
    }
  };

  const confirmClearAll = () => {
    setIsClearAllDialogOpen(true);
  };

  const handleClearAll = () => {
    clearAllMutation.mutate();
  };

  // Render star ratings
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={confirmClearAll}
            disabled={testimonials.length === 0 || clearAllMutation.isPending}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {clearAllMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Clear All
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Testimonials Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Customer</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="w-[100px]">Rating</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[100px] text-center">Approved</TableHead>
                <TableHead className="w-[100px] text-center">Homepage</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-10 bg-gray-200 animate-pulse rounded-md"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-10 mx-auto bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-10 mx-auto bg-gray-200 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-6 mx-auto bg-gray-200 animate-pulse rounded-full"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32 text-gray-500">
                    {testimonials.length === 0 
                      ? "No testimonials available." 
                      : "No testimonials match your search criteria."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTestimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          {testimonial.image ? (
                            <AvatarImage src={testimonial.image} alt={testimonial.customerName} />
                          ) : null}
                          <AvatarFallback>{testimonial.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.customerName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-2">{testimonial.content}</p>
                    </TableCell>
                    <TableCell>
                      {renderRating(testimonial.rating)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(testimonial.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={testimonial.isApproved}
                        onCheckedChange={() => handleApprovalToggle(testimonial.id)}
                        disabled={approvalMutation.isPending}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={testimonial.showOnHomepage}
                        onCheckedChange={() => handleHomepageToggle(testimonial.id)}
                        disabled={!testimonial.isApproved || homepageMutation.isPending}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => confirmDelete(testimonial)}
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
        </CardContent>
      </Card>

      {/* Delete Testimonial Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the testimonial from {selectedTestimonial?.customerName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Dialog */}
      <Dialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Testimonials</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all testimonials? This action cannot be undone and will remove all customer feedback.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearAll}
              disabled={clearAllMutation.isPending}
            >
              {clearAllMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear All'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
