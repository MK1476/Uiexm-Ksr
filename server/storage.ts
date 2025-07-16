import { 
  carouselImages, 
  categories, 
  products, 
  admins,
  type CarouselImage, 
  type InsertCarouselImage,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Admin,
  type InsertAdmin
} from "@shared/schema";
import { imageManager } from "./utils/imageUtils";

export interface IStorage {
  // Image Upload
  uploadImage(base64Data: string, filename: string): Promise<string>;

  // Carousel Images
  getCarouselImages(): Promise<CarouselImage[]>;
  getCarouselImage(id: number): Promise<CarouselImage | undefined>;
  createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage>;
  updateCarouselImage(id: number, image: Partial<InsertCarouselImage>): Promise<CarouselImage | undefined>;
  deleteCarouselImage(id: number): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getRelatedProducts(productId: number, categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Admins
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private carouselImages: Map<number, CarouselImage>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private admins: Map<number, Admin>;
  private currentCarouselId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentAdminId: number;

  constructor() {
    this.carouselImages = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.admins = new Map();
    this.currentCarouselId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentAdminId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create default admin
    this.createAdmin({
      username: "admin",
      password: "admin123",
      isActive: true,
    });

    // Create sample categories
    const tractorsCategory = this.createCategory({
      name: "Tractors",
      description: "Powerful and efficient tractors for all farming needs",
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952",
      slug: "tractors",
      isActive: true,
    });

    const harvestersCategory = this.createCategory({
      name: "Harvesters",
      description: "Advanced harvesting equipment for maximum efficiency",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
      slug: "harvesters",
      isActive: true,
    });

    const plowingCategory = this.createCategory({
      name: "Plowing Equipment",
      description: "Professional plowing tools for soil preparation",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
      slug: "plowing-equipment",
      isActive: true,
    });

    const irrigationCategory = this.createCategory({
      name: "Irrigation Systems",
      description: "Efficient water management and irrigation solutions",
      imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b",
      slug: "irrigation-systems",
      isActive: true,
    });

    // Create sample carousel images
    this.createCarouselImage({
      title: "Premium Tractors",
      imageUrl: "https://images.unsplash.com/photo-1581578949510-fa7315c4c350",
      linkUrl: "/categories/tractors",
      order: 1,
      isActive: true,
    });

    this.createCarouselImage({
      title: "Harvesting Solutions",
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
      linkUrl: "/categories/harvesters",
      order: 2,
      isActive: true,
    });

    this.createCarouselImage({
      title: "Quality Tools",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
      linkUrl: "/products",
      order: 3,
      isActive: true,
    });

    // Create sample products
    this.createProduct({
      name: "Premium Tractor Model XL-500",
      description: "High-performance tractor with advanced features for large-scale farming operations",
      price: "₹12,50,000",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64"],
      categoryId: (tractorsCategory as any).id,
      isFeatured: true,
      isActive: true,
      slug: "premium-tractor-xl-500",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      features: ["High-performance engine", "GPS navigation", "Air conditioning", "Hydraulic power steering"],
      specifications: ["Engine: 85 HP", "Fuel Tank: 65 L", "Weight: 3200 kg", "Max Speed: 40 km/h"],
    });

    this.createProduct({
      name: "Advanced Combine Harvester CH-300",
      description: "Efficient harvesting solution with cutting-edge technology for wheat, rice, and other crops",
      price: "₹28,75,000",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
      images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"],
      categoryId: (harvestersCategory as any).id,
      isFeatured: true,
      isActive: true,
      slug: "advanced-combine-harvester-ch-300",
    });

    this.createProduct({
      name: "Professional Plow System PS-200",
      description: "Durable plowing equipment for effective soil preparation and cultivation",
      price: "₹3,25,000",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
      images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b"],
      categoryId: (plowingCategory as any).id,
      isFeatured: true,
      isActive: true,
      slug: "professional-plow-system-ps-200",
    });

    this.createProduct({
      name: "Smart Irrigation System IS-150",
      description: "Automated irrigation solution with water-saving technology for optimal crop growth",
      price: "₹1,85,000",
      imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b",
      images: ["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b"],
      categoryId: (irrigationCategory as any).id,
      isFeatured: true,
      isActive: true,
      slug: "smart-irrigation-system-is-150",
    });

    this.createProduct({
      name: "Farm Tool Kit FTK-Pro",
      description: "Complete set of essential farming tools for small to medium-scale operations",
      price: "₹45,000",
      imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
      images: ["https://images.unsplash.com/photo-1605000797499-95a51c5269ae"],
      categoryId: (tractorsCategory as any).id,
      isFeatured: true,
      isActive: true,
      slug: "farm-tool-kit-ftk-pro",
    });

    this.createProduct({
      name: "Heavy Duty Cultivator HD-400",
      description: "Robust cultivator for deep soil cultivation and land preparation",
      price: "₹2,75,000",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
      images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"],
      categoryId: (plowingCategory as any).id,
      isFeatured: true,
      isActive: true,
      slug: "heavy-duty-cultivator-hd-400",
    });
  }

  // Image Upload
  async uploadImage(base64Data: string, filename: string): Promise<string> {
    const result = await imageManager.saveImage(base64Data, filename);
    return result.path;
  }

  // Carousel Images
  async getCarouselImages(): Promise<CarouselImage[]> {
    return Array.from(this.carouselImages.values())
      .filter(img => img.isActive)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  async getCarouselImage(id: number): Promise<CarouselImage | undefined> {
    return this.carouselImages.get(id);
  }

  async createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage> {
    const id = this.currentCarouselId++;
    const carouselImage: CarouselImage = { 
      ...image, 
      id,
      order: image.order ?? null,
      linkUrl: image.linkUrl ?? null,
      isActive: image.isActive ?? true
    };
    this.carouselImages.set(id, carouselImage);
    return carouselImage;
  }

  async updateCarouselImage(id: number, image: Partial<InsertCarouselImage>): Promise<CarouselImage | undefined> {
    const existing = this.carouselImages.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...image };
    this.carouselImages.set(id, updated);
    return updated;
  }

  async deleteCarouselImage(id: number): Promise<boolean> {
    return this.carouselImages.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { 
      ...category, 
      id,
      description: category.description ?? null,
      imageUrl: category.imageUrl ?? null,
      isActive: category.isActive ?? true
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(prod => prod.slug === slug);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(prod => 
      prod.categoryId === categoryId && prod.isActive
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(prod => 
      prod.isFeatured && prod.isActive
    );
  }

  async getRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(prod => prod.categoryId === categoryId && prod.id !== productId && prod.isActive)
      .slice(0, 4);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Check for duplicate slug
    const existingProduct = Array.from(this.products.values()).find(p => p.slug === product.slug);
    if (existingProduct) {
      throw new Error(`Product with slug "${product.slug}" already exists`);
    }

    const id = this.currentProductId++;
    const newProduct: Product = { 
      ...product, 
      id,
      description: product.description ?? null,
      imageUrl: product.imageUrl ?? null,
      isActive: product.isActive ?? true,
      price: product.price ?? null,
      images: product.images ?? null,
      categoryId: product.categoryId ?? null,
      isFeatured: product.isFeatured ?? false,
      youtubeUrl: product.youtubeUrl ?? null,
      features: product.features ?? null,
      specifications: product.specifications ?? null,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    // Check for duplicate slug if slug is being updated
    if (product.slug && product.slug !== existing.slug) {
      const existingProduct = Array.from(this.products.values()).find(p => p.slug === product.slug && p.id !== id);
      if (existingProduct) {
        throw new Error(`Product with slug "${product.slug}" already exists`);
      }
    }
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Admins
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.username === username);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const newAdmin: Admin = { 
      ...admin, 
      id,
      isActive: admin.isActive ?? true
    };
    this.admins.set(id, newAdmin);
    return newAdmin;
  }
}

export const storage = new MemStorage();
