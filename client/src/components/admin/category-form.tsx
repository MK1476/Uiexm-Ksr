import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCategorySchema, type Category } from "@shared/schema";
import { z } from "zod";

const categoryFormSchema = insertCategorySchema.extend({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

interface CategoryFormProps {
  category?: Category;
  onSave: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || "");

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      imageUrl: category?.imageUrl || "",
      slug: category?.slug || "",
      isActive: category?.isActive ?? true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categoryFormSchema>) => {
      const payload = { ...data, imageUrl };
      if (category?.id) {
        return apiRequest("PUT", `/api/categories/${category.id}`, payload);
      } else {
        return apiRequest("POST", "/api/categories", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: `Category ${category?.id ? "updated" : "created"} successfully`,
      });
      onSave();
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof categoryFormSchema>) => {
    saveMutation.mutate(data);
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!category?.id) { // Only auto-generate for new categories
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      form.setValue("slug", slug);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {category?.id ? "Edit Category" : "Add New Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category name" 
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="category-url-slug" 
                      {...field}
                      disabled={!!category?.id} // Disable editing slug for existing categories
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500">
                    {category?.id ? "Slug cannot be changed after creation" : "Auto-generated from name, or enter custom slug"}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter category description" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Category Image (Optional)</Label>
              <ImageUpload
                onImageUpload={setImageUrl}
                currentImage={imageUrl}
                className="w-full"
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <div className="text-sm text-gray-500">
                      Show this category on the website
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

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                {saveMutation.isPending ? "Saving..." : "Save Category"}
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