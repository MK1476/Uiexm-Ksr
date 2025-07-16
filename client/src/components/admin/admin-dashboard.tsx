import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Save,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ImageUpload } from "@/components/image-upload";
import { ProductForm } from "./product-form";
import { useLanguage } from "@/contexts/language-context";
import type { CarouselImage, Category, Product } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
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

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    setFormData(item);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const { type, id, ...data } = formData;
      const endpoint = type === "carousel" ? "/api/carousel" : 
                     type === "category" ? "/api/categories" : 
                     "/api/products";
      
      if (id) {
        await apiRequest("PUT", `${endpoint}/${id}`, data);
      } else {
        await apiRequest("POST", endpoint, data);
      }
      
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setEditingItem(null);
      setFormData({});
      toast({
        title: "Success",
        description: `${type} ${id ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const endpoint = type === "carousel" ? "/api/carousel" : 
                     type === "category" ? "/api/categories" : 
                     "/api/products";
      
      await apiRequest("DELETE", `${endpoint}/${id}`);
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleAdd = (type: string) => {
    if (type === "product") {
      setEditingProduct(undefined);
      setShowProductForm(true);
    } else {
      const defaultData = {
        carousel: { title: "", imageUrl: "", linkUrl: "", order: 0, isActive: true },
        category: { name: "", description: "", imageUrl: "", slug: "", isActive: true },
      };
      
      setEditingItem({ type });
      setFormData(defaultData[type as keyof typeof defaultData]);
    }
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
            <TabsTrigger value="carousel">Carousel Images</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="carousel" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Carousel Images</h2>
              <Button onClick={() => handleAdd("carousel")}>
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
                          onClick={() => handleEdit(image, "carousel")}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(image.id, "carousel")}
                        >
                          <Trash2 className="h-4 w-4" />
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
              <Button onClick={() => handleAdd("category")}>
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
                          onClick={() => handleEdit(category, "category")}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id, "category")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            {showProductForm ? (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSave={handleProductSave}
                onCancel={handleProductCancel}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <Button onClick={() => handleAdd("product")}>
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
                                  {product.isActive ? t('available') : t('unavailable')}
                                </Badge>
                                {product.isFeatured && (
                                  <Badge variant="outline">{t('featured')}</Badge>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleProductEdit(product)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(product.id, "product")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Form Modal */}
        {editingItem && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>
                {editingItem.id ? "Edit" : "Add New"} {editingItem.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editingItem.type === "carousel" && (
                  <>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Image</Label>
                      <ImageUpload
                        onImageUpload={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
                        currentImage={formData.imageUrl}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkUrl">Link URL</Label>
                      <Input
                        id="linkUrl"
                        value={formData.linkUrl || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.isActive || false}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </>
                )}

                {editingItem.type === "category" && (
                  <>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Image</Label>
                      <ImageUpload
                        onImageUpload={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
                        currentImage={formData.imageUrl}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.isActive || false}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </>
                )}

                <div className="flex space-x-4 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;