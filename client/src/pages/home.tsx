import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Truck, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { Link } from "wouter";
import HeroCarousel from "@/components/hero-carousel";
import ProductCard from "@/components/product-card";
import { useLanguage } from "@/contexts/language-context";
import type { Category, Product } from "@shared/schema";

const Home = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = allProducts.filter(product => product.isFeatured && product.isActive !== false);

  // Filter products based on search query
  const filteredProducts = allProducts.filter(product => {
    if (!searchQuery) return false;
    
    const category = categories.find(cat => cat.id === product.categoryId);
    const searchLower = searchQuery.toLowerCase();
    
    return (product.isActive !== false) && (
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      category?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Company Description */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {t("heroTitle")}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="max-w-md mx-auto mb-8">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder={t('searchByName')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("qualityEquipment")}</h3>
                <p className="text-gray-600">{t("qualityEquipmentDesc")}</p>
              </div>
              <div className="text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("expertSupport")}</h3>
                <p className="text-gray-600">{t("expertSupportDesc")}</p>
              </div>
              <div className="text-center">
                <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("affordablePricing")}</h3>
                <p className="text-gray-600">{t("affordablePricingDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("productCategories")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("categoriesSubtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="card-hover group cursor-pointer premium-card premium-shadow">
                <Link href={`/categories/${category.slug}`}>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={category.imageUrl || "/placeholder-category.jpg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary hover:text-primary/80 font-medium">
                      {t("viewProducts")}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">{t("noProductsFound")}</p>
              </div>
            )}
            
            {filteredProducts.length > 6 && (
              <div className="text-center mt-12">
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    View All Results
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("featuredProducts")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("productsSubtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t("viewAllProducts")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
