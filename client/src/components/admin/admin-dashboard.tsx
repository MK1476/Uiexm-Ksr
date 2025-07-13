import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit2, Trash2, LogOut, Save } from "lucide-react";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CarouselImage, Category, Product } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("carousel");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
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
    logout();
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
    const defaultData = {
      carousel: { title: "", imageUrl: "", linkUrl: "", order: 0, isActive: true },
      category: { name: "", description: "", imageUrl: "", slug: "", isActive: true },
      product: { name: "", description: "", price: "", imageUrl: "", slug: "", isFeatured: false, isActive: true },
    };
    
    setEditingItem({ type });
    setFormData(defaultData[type as keyof typeof defaultData]);
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
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Products</h2>
              <Button onClick={() => handleAdd("product")}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
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
                          onClick={() => handleEdit(product, "product")}
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
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Form Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {editingItem.id ? "Edit" : "Add"} {editingItem.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingItem.type === "carousel" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkUrl">Link URL</Label>
                      <Input
                        id="linkUrl"
                        value={formData.linkUrl || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, linkUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order || 0}
                        onChange={(e: { target: { value: string; }; }) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked: any) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </>
                )}

                {editingItem.type === "category" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked: any) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </>
                )}

                {editingItem.type === "product" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        value={formData.price || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug || ""}
                        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked: any) => setFormData({ ...formData, isFeatured: checked })}
                      />
                      <Label htmlFor="isFeatured">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked: any) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
