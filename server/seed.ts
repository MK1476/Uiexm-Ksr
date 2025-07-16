import { db } from "./db";
import { carouselImages, categories, products, admins } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    await db.insert(admins).values({
      username: "admin",
      password: "admin123", // In production, this should be hashed
      isActive: true
    }).onConflictDoNothing();

    // Create sample categories
    const [tractorCategory] = await db.insert(categories).values({
      name: "Tractors",
      description: "Powerful agricultural tractors for all farming needs",
      slug: "tractors",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
      isActive: true
    }).returning().onConflictDoNothing();

    const [harvestCategory] = await db.insert(categories).values({
      name: "Harvesters", 
      description: "Efficient harvesting equipment for maximum productivity",
      slug: "harvesters",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
      isActive: true
    }).returning().onConflictDoNothing();

    const [tillageCategory] = await db.insert(categories).values({
      name: "Tillage Equipment",
      description: "Soil preparation and cultivation tools",
      slug: "tillage-equipment", 
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      isActive: true
    }).returning().onConflictDoNothing();

    // Create sample products
    await db.insert(products).values([
      {
        name: "Premium Tractor Model XL-500",
        description: "High-performance tractor designed for large-scale farming operations with advanced hydraulics and fuel-efficient engine.",
        price: "₹12,50,000",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
        categoryId: tractorCategory?.id || 1,
        isFeatured: true,
        isActive: true,
        slug: "premium-tractor-xl-500",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        features: ["120 HP Engine", "4WD System", "Advanced Hydraulics", "Comfortable Cabin"],
        specifications: ["Engine: 4-cylinder turbo diesel", "Power: 120 HP", "Transmission: 12F+12R", "Fuel Tank: 180L"]
      },
      {
        name: "Compact Harvester CH-200",
        description: "Efficient compact harvester perfect for small to medium farms with excellent grain quality and minimal losses.",
        price: "₹8,75,000", 
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
        categoryId: harvestCategory?.id || 2,
        isFeatured: true,
        isActive: true,
        slug: "compact-harvester-ch-200",
        features: ["2.5m Cutting Width", "Grain Tank 1500L", "Low Fuel Consumption", "Easy Maintenance"],
        specifications: ["Cutting Width: 2.5m", "Engine: 85 HP", "Grain Tank: 1500L", "Threshing: Axial Flow"]
      },
      {
        name: "Heavy Duty Cultivator HD-300",
        description: "Robust cultivator for deep soil preparation and stubble management with adjustable working width.",
        price: "₹2,25,000",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", 
        categoryId: tillageCategory?.id || 3,
        isFeatured: false,
        isActive: true,
        slug: "heavy-duty-cultivator-hd-300",
        features: ["Working Width 3m", "Heavy Duty Frame", "Adjustable Depth", "Spring Loaded Tines"],
        specifications: ["Working Width: 3m", "Weight: 850kg", "Tines: 21 nos", "Required Power: 60-80 HP"]
      }
    ]).onConflictDoNothing();

    // Create sample carousel images
    await db.insert(carouselImages).values([
      {
        title: "Premium Tractors",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200",
        isActive: true
      },
      {
        title: "Advanced Harvesters", 
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200",
        isActive: true
      },
      {
        title: "Quality Equipment",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200", 
        isActive: true
      }
    ]).onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

export { seed };