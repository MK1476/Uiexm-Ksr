import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  Image as ImageIcon,
  Package,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ProductForm } from "./product-form";
import { CarouselForm } from "./carousel-form";
import { CategoryForm } from "./category-form";
import { useLanguage } from "@/contexts/language-context";
import type { CarouselImage, Category, Product } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Product management state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // Carousel management state
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<CarouselImage | undefined>(undefined);
  
  // Category management state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: carouselImages = [] } = useQuery<CarouselImage[]>({
    queryKey: ["/api/carousel"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleLogout = () => {
    onLogout();
  };

  // Delete functionality with loading states
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: string }) => {
      const endpoint = type === "carousel" ? "/api/carousel" : 
                     type === "category" ? "/api/categories" : 
                     "/api/products";
      return apiRequest("DELETE", `${endpoint}/${id}`);
    },
    onSuccess: (_, { type }) => {
      const endpoint = type === "carousel" ? "/api/carousel" : 
                     type === "category" ? "/api/categories" : 
                     "/api/products";
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number, type: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id, type });
  };

  // Carousel handlers
  const handleCarouselAdd = () => {
    setEditingCarousel(undefined);
    setShowCarouselForm(true);
  };

  const handleCarouselEdit = (carousel: CarouselImage) => {
    setEditingCarousel(carousel);
    setShowCarouselForm(true);
  };

  const handleCarouselSave = () => {
    setShowCarouselForm(false);
    setEditingCarousel(undefined);
  };

  const handleCarouselCancel = () => {
    setShowCarouselForm(false);
    setEditingCarousel(undefined);
  };

  // Category handlers
  const handleCategoryAdd = () => {
    setEditingCategory(undefined);
    setShowCategoryForm(true);
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleCategorySave = () => {
    setShowCategoryForm(false);
    setEditingCategory(undefined);
  };

  const handleCategoryCancel = () => {
    setShowCategoryForm(false);
    setEditingCategory(undefined);
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductSave = async (productData: any) => {
    try {
      if (editingProduct) {
        await apiRequest("PUT", `/api/products/${editingProduct.id}`, productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/products", productData);
        toast({
          title: "Success", 
          description: "Product created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductForm(false);
      setEditingProduct(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleProductCancel = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  // Show forms when editing
  if (showCarouselForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleCarouselCancel}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Carousel
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <CarouselForm
            carousel={editingCarousel}
            onSave={handleCarouselSave}
            onCancel={handleCarouselCancel}
          />
        </div>
      </div>
    );
  }

  if (showCategoryForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleCategoryCancel}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <CategoryForm
            category={editingCategory}
            onSave={handleCategorySave}
            onCancel={handleCategoryCancel}
          />
        </div>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleProductCancel}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSave={handleProductSave}
            onCancel={handleProductCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carousel" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Carousel
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carousel" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Carousel Images</h2>
              <Button onClick={handleCarouselAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Image
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {carouselImages.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-4">
                    {image.imageUrl && (
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold mb-2">{image.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant={image.isActive ? "default" : "secondary"}>
                        {image.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCarouselEdit(image)}
                          disabled={deleteMutation.isPending}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(image.id, "carousel")}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "..." : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Button onClick={handleCategoryAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    {category.imageUrl && (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCategoryEdit(category)}
                          disabled={deleteMutation.isPending}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id, "category")}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "..." : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Products</h2>
              <Button onClick={() => { setEditingProduct(undefined); setShowProductForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Label htmlFor="category-filter" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Category:
              </Label>
              <Select
                value={selectedCategory?.toString() || 'all'}
                onValueChange={(value) => setSelectedCategory(value === 'all' ? null : Number(value))}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter(product => !selectedCategory || product.categoryId === selectedCategory)
                .map((product) => {
                  const category = categories.find(cat => cat.id === product.categoryId);
                  return (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        )}
                        <h3 className="font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        {category && (
                          <p className="text-xs text-blue-600 mb-2">{category.name}</p>
                        )}
                        {product.price && (
                          <p className="text-lg font-bold text-primary mb-2">{product.price}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {product.isFeatured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                              disabled={deleteMutation.isPending}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product.id, "product")}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "..." : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default AdminDashboard;