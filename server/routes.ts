import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCarouselImageSchema, 
  insertCategorySchema, 
  insertProductSchema, 
  loginSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Image Upload
  app.post("/api/upload", async (req, res) => {
    try {
      const { base64Data, filename } = req.body;
      
      if (!base64Data || !filename) {
        return res.status(400).json({ message: "Missing required fields: base64Data and filename" });
      }

      // Validate base64 data
      if (!base64Data.startsWith('data:image/')) {
        return res.status(400).json({ message: "Invalid image format. Must be a valid base64 image." });
      }

      // Validate filename
      if (typeof filename !== 'string' || filename.length === 0) {
        return res.status(400).json({ message: "Invalid filename provided" });
      }

      // Extract file extension
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: "Unsupported file type. Please use JPG, PNG, WebP, or GIF." });
      }

      // Calculate base64 size (approximate file size)
      const base64Size = base64Data.length * 0.75; // Base64 is ~33% larger than binary
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      
      if (base64Size > maxSize) {
        return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
      }
      
      const imagePath = await storage.uploadImage(base64Data, filename);
      res.json({ path: imagePath });
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to upload image" });
      }
    }
  });

  // Carousel Images
  app.get("/api/carousel", async (req, res) => {
    try {
      const images = await storage.getCarouselImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  app.post("/api/carousel", async (req, res) => {
    try {
      const data = insertCarouselImageSchema.parse(req.body);
      const image = await storage.createCarouselImage(data);
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create carousel image" });
      }
    }
  });

  app.put("/api/carousel/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCarouselImageSchema.partial().parse(req.body);
      const image = await storage.updateCarouselImage(id, data);
      if (!image) {
        return res.status(404).json({ message: "Carousel image not found" });
      }
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update carousel image" });
      }
    }
  });

  app.delete("/api/carousel/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCarouselImage(id);
      if (!success) {
        return res.status(404).json({ message: "Carousel image not found" });
      }
      res.json({ message: "Carousel image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete carousel image" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, data);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured } = req.query;
      let products;
      
      if (category) {
        const categoryData = await storage.getCategoryBySlug(category as string);
        if (!categoryData) {
          return res.status(404).json({ message: "Category not found" });
        }
        products = await storage.getProductsByCategory(categoryData.id);
      } else if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/:id/related", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const relatedProducts = await storage.getRelatedProducts(id, product.categoryId!);
      res.json(relatedProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Product creation error:", error);
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Product update error:", error);
        res.status(500).json({ message: "Failed to update product" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd generate a JWT token here
      res.json({ 
        message: "Login successful", 
        admin: { id: admin.id, username: admin.username }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
