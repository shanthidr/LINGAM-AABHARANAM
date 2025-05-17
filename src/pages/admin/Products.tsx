import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProducts, 
  Product, 
  deleteProduct, 
  createProduct, 
  updateProduct 
} from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
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
  Pencil,
  Trash2,
  MoreVertical,
  Search,
  Plus,
  Image,
  Loader2,
  Upload,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });
  
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Product Added',
        description: 'The product has been added successfully.'
      });
      setIsProductDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) => 
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Product Updated',
        description: 'The product has been updated successfully.'
      });
      setIsProductDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Product Deleted',
          description: 'The product has been removed from the catalog.'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        });
      }
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id);
  };
  
  const openProductDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct({ ...product });
      setIsEditMode(true);
    } else {
      setCurrentProduct({
        name: '',
        category: 'jewelry',
        subcategory: '',
        price: 0,
        description: '',
        details: '',
        images: [],
        weight: '',
        material: '',
        inStock: true,
        featured: false,
      });
      setIsEditMode(false);
    }
    setIsProductDialogOpen(true);
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setCurrentProduct({
        ...currentProduct,
        images: [...(currentProduct.images || []), imageUrl]
      });
    };
    
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    sonnerToast.success('Image uploaded successfully');
  };
  
  const removeImage = (index: number) => {
    const newImages = [...(currentProduct.images || [])];
    newImages.splice(index, 1);
    setCurrentProduct({...currentProduct, images: newImages});
  };
  
  const handleSaveProduct = () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.description || 
        !currentProduct.weight || !currentProduct.material) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!currentProduct.images || currentProduct.images.length === 0) {
      toast({
        title: 'Image Required',
        description: 'Please upload at least one product image.',
        variant: 'destructive',
      });
      return;
    }

    if (isEditMode && currentProduct.id) {
      const { id, ...updates } = currentProduct;
      updateProductMutation.mutate({ id, updates });
    } else {
      createProductMutation.mutate(currentProduct as Omit<Product, 'id' | 'createdAt'>);
    }
  };

  const isMutating = 
    createProductMutation.isPending || 
    updateProductMutation.isPending || 
    deleteProductMutation.isPending;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        
        <Button 
          onClick={() => openProductDialog()} 
          className="bg-brand-gold hover:bg-brand-gold-dark"
          disabled={isMutating}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="jewelry">Jewelry</SelectItem>
            <SelectItem value="idol">Idols & Articles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md"></div></TableCell>
                  <TableCell><div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div></TableCell>
                  <TableCell className="text-right"><div className="w-16 h-4 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="w-16 h-4 bg-gray-200 animate-pulse rounded mx-auto"></div></TableCell>
                  <TableCell className="text-right"><div className="w-24 h-4 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                  <TableCell className="text-right"><div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-gray-500">
                  {products.length === 0 
                    ? "No products in the catalog. Add your first product!" 
                    : "No products match your search criteria"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.salePrice ? (
                      <div>
                        <span className="text-red-600">
                          {formatPrice(product.salePrice)}
                        </span>
                        <span className="text-gray-400 line-through text-xs ml-1">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.inStock ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(product.createdAt)}
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
                          onClick={() => openProductDialog(product)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => confirmDelete(product)}
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
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
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
      
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the product details below.' 
                : 'Fill in the details to add a new product to the catalog.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={currentProduct.category || 'jewelry'}
                    onValueChange={(value: any) => setCurrentProduct({...currentProduct, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="idol">Idol & Articles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subcategory">Subcategory *</Label>
                  <Input
                    id="subcategory"
                    value={currentProduct.subcategory || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, subcategory: e.target.value})}
                    placeholder="E.g., rings, pendants"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Regular Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={currentProduct.price || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sale-price">Sale Price ($)</Label>
                  <Input
                    id="sale-price"
                    type="number"
                    value={currentProduct.salePrice || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, salePrice: Number(e.target.value) || undefined})}
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Input
                  id="description"
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  placeholder="Brief product description"
                />
              </div>
              
              <div>
                <Label htmlFor="details">Detailed Description</Label>
                <Textarea
                  id="details"
                  value={currentProduct.details || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, details: e.target.value})}
                  placeholder="Detailed product information..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Product Images *</Label>
                <div className="border rounded-md p-4 mt-1">
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.images?.map((image, index) => (
                      <div 
                        key={index} 
                        className="w-20 h-20 border rounded-md overflow-hidden relative group"
                      >
                        <img 
                          src={image} 
                          alt={`Product ${index+1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-20 h-20 flex flex-col items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5 mb-1" />
                      <span className="text-xs">Upload</span>
                    </Button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight *</Label>
                  <Input
                    id="weight"
                    value={currentProduct.weight || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, weight: e.target.value})}
                    placeholder="E.g., 25 grams"
                  />
                </div>
                
                <div>
                  <Label htmlFor="material">Material *</Label>
                  <Input
                    id="material"
                    value={currentProduct.material || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, material: e.target.value})}
                    placeholder="E.g., 925 Sterling Silver"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={currentProduct.dimensions || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, dimensions: e.target.value})}
                  placeholder="E.g., 5 x 3 x 8 inches"
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="in-stock">Stock Status</Label>
                  <div className="text-sm text-muted-foreground">
                    Is this product in stock?
                  </div>
                </div>
                <Switch
                  id="in-stock"
                  checked={currentProduct.inStock}
                  onCheckedChange={(checked) => setCurrentProduct({...currentProduct, inStock: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Product</Label>
                  <div className="text-sm text-muted-foreground">
                    Show this product on the homepage?
                  </div>
                </div>
                <Switch
                  id="featured"
                  checked={currentProduct.featured}
                  onCheckedChange={(checked) => setCurrentProduct({...currentProduct, featured: checked})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProduct}
              className="bg-brand-gold hover:bg-brand-gold-dark"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
            >
              {createProductMutation.isPending || updateProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Product' : 'Add Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
