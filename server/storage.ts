import { CarouselImage, InsertCarouselImage, Category, InsertCategory, Product, InsertProduct, Admin, InsertAdmin, carouselImages, categories, products, admins } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';

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

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async uploadImage(base64Data: string, filename: string): Promise<string> {
    const { imageManager } = await import('./utils/imageUtils');
    const result = await imageManager.saveImage(base64Data, filename);
    return result.path;
  }

  // Carousel Images
  async getCarouselImages(): Promise<CarouselImage[]> {
    return await db.select().from(carouselImages).where(eq(carouselImages.isActive, true));
  }

  async getCarouselImage(id: number): Promise<CarouselImage | undefined> {
    const [image] = await db.select().from(carouselImages).where(eq(carouselImages.id, id));
    return image || undefined;
  }

  async createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage> {
    const [newImage] = await db.insert(carouselImages).values(image).returning();
    return newImage;
  }

  async updateCarouselImage(id: number, image: Partial<InsertCarouselImage>): Promise<CarouselImage | undefined> {
    const [updated] = await db.update(carouselImages)
      .set(image)
      .where(eq(carouselImages.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCarouselImage(id: number): Promise<boolean> {
    const result = await db.delete(carouselImages).where(eq(carouselImages.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    // Check for duplicate slug
    const existing = await this.getCategoryBySlug(category.slug);
    if (existing) {
      throw new Error(`Category with slug "${category.slug}" already exists`);
    }

    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    // Check for duplicate slug if slug is being updated
    if (category.slug) {
      const existing = await this.getCategoryBySlug(category.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Category with slug "${category.slug}" already exists`);
      }
    }

    const [updated] = await db.update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.isFeatured, true), eq(products.isActive, true)));
  }

  async getRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true)
      ))
      .limit(4);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Check for duplicate slug
    const existing = await this.getProductBySlug(product.slug);
    if (existing) {
      throw new Error(`Product with slug "${product.slug}" already exists`);
    }

    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    // Check for duplicate slug if slug is being updated
    if (product.slug) {
      const existing = await this.getProductBySlug(product.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Product with slug "${product.slug}" already exists`);
      }
    }

    const [updated] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Admins
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }
}

export const storage = new DatabaseStorage();