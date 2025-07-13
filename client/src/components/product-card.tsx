import { MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { generateProductEnquiryLink, openWhatsApp } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();

  const handleWhatsAppEnquiry = () => {
    const link = generateProductEnquiryLink(product.name, product.price || undefined);
    openWhatsApp(link);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product from KSR Agros: ${product.name}`,
      url: `${window.location.origin}/product/${product.slug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="card-hover group">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <CardContent className="p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {product.price && (
          <p className="text-2xl font-bold text-primary mb-4">
            {product.price}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleWhatsAppEnquiry}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Enquire Now
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="sm:w-auto"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
