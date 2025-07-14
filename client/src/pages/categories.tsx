import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { Category, Product } from "@shared/schema";

const Categories = () => {
  const { slug } = useParams<{ slug?: string }>();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", slug],
    enabled: !!slug,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", slug ? `category=${slug}` : ""],
    enabled: !slug || !!category,
  });

  if (slug && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The requested category could not be found.</p>
        </div>
      </div>
    );
  }

  // If viewing a specific category
  if (slug && category) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {category.description}
              </p>
              {category.imageUrl && (
                <div className="aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Products in Category */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Products in {category.name}
            </h2>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Categories listing page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Product Categories
            </h1>
            <p className="text-lg text-gray-600">
              Explore our comprehensive range of agricultural equipment categories
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.id} className="card-hover group cursor-pointer">
                <Link href={`/categories/${category.slug}`}>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={category.imageUrl || "/placeholder-category.jpg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary hover:text-primary/80 font-medium">
                      View Products
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
