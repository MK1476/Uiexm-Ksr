import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, X } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema, type Product, type Category } from "@shared/schema";
import { z } from "zod";

const productFormSchema = insertProductSchema.extend({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  categoryId: z.coerce.number().min(1, "Category is required"),
}).omit({
  images: true, // Remove images array validation since we're not using it
});

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [newFeature, setNewFeature] = useState('');
  const [newSpecification, setNewSpecification] = useState('');
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [specifications, setSpecifications] = useState<string[]>(product?.specifications || []);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      imageUrl: product?.imageUrl || "",
      categoryId: product?.categoryId || (categories[0]?.id || 1),
      isFeatured: product?.isFeatured || false,
      isActive: product?.isActive ?? true,
      slug: product?.slug || "",
      youtubeUrl: product?.youtubeUrl || "",
      features: product?.features || [],
      specifications: product?.specifications || [],
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof productFormSchema>) => {
      const payload = { 
        ...data, 
        imageUrl, 
        features: features.length > 0 ? features : [],
        specifications: specifications.length > 0 ? specifications : [],
        images: [], // Ensure images array is included as empty array
      };
      
      // Remove empty or undefined values to avoid validation issues
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === '') {
          if (key === 'description' || key === 'price' || key === 'youtubeUrl') {
            payload[key] = ''; // Keep empty strings for optional text fields
          } else if (key === 'features' || key === 'specifications' || key === 'images') {
            payload[key] = []; // Keep empty arrays for array fields
          }
        }
      });
      
      console.log("Submitting payload:", payload);
      
      if (product?.id) {
        return apiRequest("PUT", `/api/products/${product.id}`, payload);
      } else {
        return apiRequest("POST", "/api/products", payload);
      }
    },
    onSuccess: (response) => {
      console.log("Product saved successfully:", response);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: `Product ${product?.id ? "updated" : "created"} successfully`,
      });
      // Use setTimeout to ensure the success callback completes before navigation
      setTimeout(() => {
        onSave();
      }, 100);
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      
      // Only show error if it's not a duplicate submission issue
      if (error?.response?.status === 409) {
        toast({
          title: "Error",
          description: "A product with this slug already exists. Please try a different name.",
          variant: "destructive",
        });
      } else if (error?.response?.status !== 200) {
        // Only show error for non-success responses
        let errorMessage = "Failed to save product";
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof productFormSchema>) => {
    // Prevent multiple submissions
    if (saveMutation.isPending) {
      return;
    }
    
    console.log("Form submitted with data:", data);
    saveMutation.mutate(data);
  };

  // Auto-generate unique slug from name
  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!product?.id) { // Only auto-generate for new products
      const baseSlug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      // Add timestamp to ensure uniqueness
      const uniqueSlug = baseSlug ? `${baseSlug}-${Date.now()}` : `product-${Date.now()}`;
      form.setValue("slug", uniqueSlug);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const newFeatures = [...features, newFeature.trim()];
      setFeatures(newFeatures);
      form.setValue("features", newFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const addSpecification = () => {
    if (newSpecification.trim()) {
      const newSpecs = [...specifications, newSpecification.trim()];
      setSpecifications(newSpecs);
      form.setValue("specifications", newSpecs);
      setNewSpecification('');
    }
  };

  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    form.setValue("specifications", newSpecs);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product name" 
                          {...field} 
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="₹1,00,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        value={field.value?.toString()} 
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="product-url-slug" 
                          {...field}
                          disabled={!!product?.id}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500">
                        {product?.id ? "Slug cannot be changed after creation" : "Auto-generated from name, or enter custom slug"}
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image and Description */}
              <div className="space-y-4">
                <div>
                  <Label>Product Image</Label>
                  <ImageUpload
                    onImageUpload={setImageUrl}
                    currentImage={imageUrl}
                    className="w-full"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter product description" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Features Section */}
            <div>
              <Label>Features</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-auto p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div>
              <Label>Specifications</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSpecification}
                    onChange={(e) => setNewSpecification(e.target.value)}
                    placeholder="Add a specification..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                  />
                  <Button type="button" onClick={addSpecification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specifications.map((spec: string, index: number) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {spec}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        className="h-auto p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Switches */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Product</FormLabel>
                      <div className="text-sm text-gray-500">
                        Show this product in featured sections
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-gray-500">
                        Show this product on the website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                {saveMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={saveMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}