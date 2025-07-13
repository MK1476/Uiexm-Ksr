import { useQuery } from "@tanstack/react-query";
import { Award, Truck, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import HeroCarousel from "@/components/hero-carousel";
import ProductCard from "@/components/product-card";
import type { Category, Product } from "@shared/schema";

const Home = () => {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (data) => data.filter(product => product.isFeatured),
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
              Welcome to KSR Agros
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At KSR Agros, we are dedicated to empowering farmers and agricultural professionals with premium quality farming machinery and equipment. 
              With years of experience in the agricultural industry, we provide reliable, durable, and innovative solutions that help increase productivity 
              and efficiency in farming operations. From tractors and harvesters to specialized tools, we offer a comprehensive range of products 
              designed to meet the diverse needs of modern agriculture.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assured</h3>
                <p className="text-gray-600">Premium quality machinery from trusted manufacturers</p>
              </div>
              <div className="text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable delivery across all regions</p>
              </div>
              <div className="text-center">
                <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support and service</p>
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
              Our Product Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore our comprehensive range of agricultural equipment
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

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Discover our most popular and highly-rated farming equipment
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
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
