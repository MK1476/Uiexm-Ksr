import { MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { generateProductEnquiryLink, openWhatsApp } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/language-context";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

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
          title: t("success"),
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
    <Card className="card-hover group premium-card premium-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
          <img
            src={product.imageUrl || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isActive === false && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-white font-semibold">
                {t('unavailable')}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={product.isActive !== false ? "secondary" : "destructive"}>
            {product.isActive !== false ? t('available') : t('unavailable')}
          </Badge>
          {product.isFeatured && (
            <Badge variant="default">{t('featured')}</Badge>
          )}
        </div>
        
        {product.description && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
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
        <div className="flex gap-3 w-full">
          <Button
            onClick={handleWhatsAppEnquiry}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("enquireNow")}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            size={isMobile ? "icon" : "default"}
            className="border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
          >
            <Share2 className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{t("share")}</span>}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
