import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCarouselImageSchema, type CarouselImage } from "@shared/schema";
import { z } from "zod";

const carouselFormSchema = insertCarouselImageSchema.extend({
  order: z.coerce.number().min(0, "Order must be 0 or greater"),
});

interface CarouselFormProps {
  carousel?: CarouselImage;
  onSave: () => void;
  onCancel: () => void;
}

export function CarouselForm({ carousel, onSave, onCancel }: CarouselFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(carousel?.imageUrl || "");

  const form = useForm<z.infer<typeof carouselFormSchema>>({
    resolver: zodResolver(carouselFormSchema),
    defaultValues: {
      title: carousel?.title || "",
      imageUrl: carousel?.imageUrl || "",
      linkUrl: carousel?.linkUrl || "",
      order: carousel?.order || 0,
      isActive: carousel?.isActive ?? true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof carouselFormSchema>) => {
      const payload = { ...data, imageUrl };
      if (carousel?.id) {
        return apiRequest("PUT", `/api/carousel/${carousel.id}`, payload);
      } else {
        return apiRequest("POST", "/api/carousel", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carousel"] });
      toast({
        title: "Success",
        description: `Carousel ${carousel?.id ? "updated" : "created"} successfully`,
      });
      onSave();
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save carousel",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof carouselFormSchema>) => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {carousel?.id ? "Edit Carousel Item" : "Add New Carousel Item"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter carousel title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                onImageUpload={setImageUrl}
                currentImage={imageUrl}
                className="w-full"
              />
            </div>

            <FormField
              control={form.control}
              name="linkUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
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
                      Show this carousel item on the website
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
                {saveMutation.isPending ? "Saving..." : "Save Carousel"}
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