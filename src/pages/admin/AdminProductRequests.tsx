
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type ProductRequest = {
  id: string;
  user_id: string;
  product_id: string;
  requested_at: string;
  status: string;
  message: string | null;
};

const fetchProductRequests = async (): Promise<ProductRequest[]> => {
  const { data, error } = await supabase
    .from('product_requests')
    .select('*')
    .order('requested_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const AdminProductRequests = () => {
  const { data, isLoading, error } = useQuery<ProductRequest[]>({
    queryKey: ['product_requests'],
    queryFn: fetchProductRequests,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = data ? data.filter(req => 
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.product_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.message && req.message.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin h-6 w-6 text-brand-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load product requests: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Requests</h1>
        <div className="relative w-64">
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Request ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="max-w-[200px]">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs">{req.id.substring(0, 8)}...</TableCell>
                  <TableCell className="font-mono text-xs">{req.user_id.substring(0, 8)}...</TableCell>
                  <TableCell>{req.product_id}</TableCell>
                  <TableCell>{new Date(req.requested_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(req.status)}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {req.message ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-gray-500">
            {searchTerm ? 'No requests match your search.' : 'No product requests found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminProductRequests;
