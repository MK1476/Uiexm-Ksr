import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import type { Product, Category } from "@shared/schema";

const Products = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return product.isActive !== false; // Only show available products
    
    const category = categories.find(cat => cat.id === product.categoryId);
    const searchLower = searchQuery.toLowerCase();
    
    return (product.isActive !== false) && (
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      category?.name.toLowerCase().includes(searchLower)
    );
  });

  // Group filtered products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const categoryId = product.categoryId || 0;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<number, Product[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("ourProducts")}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {t("productsSubtitle")}
            </p>
            <div className="max-w-md mx-auto">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder={t('searchByName')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery ? t("noProductsFound") : t("noProductsAvailable")}
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => {
                const categoryProducts = productsByCategory[category.id] || [];
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {category.name}
                        </h2>
                        <p className="text-gray-600">
                          {category.description}
                        </p>
                      </div>
                      <Link href={`/categories/${category.slug}`}>
                        <Badge variant="outline" className="hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer">
                          {t("viewAll")} {category.name} →
                        </Badge>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Products without category */}
              {productsByCategory[0] && productsByCategory[0].length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Other Products
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productsByCategory[0].map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
