import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

export interface ImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export class ImageManager {
  private static instance: ImageManager;
  private uploadDir = path.join(process.cwd(), 'uploads');
  private publicDir = path.join(process.cwd(), 'client', 'public', 'uploads');

  private constructor() {
    this.ensureDirectories();
  }

  public static getInstance(): ImageManager {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager();
    }
    return ImageManager.instance;
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await stat(this.uploadDir);
    } catch {
      await mkdir(this.uploadDir, { recursive: true });
    }

    try {
      await stat(this.publicDir);
    } catch {
      await mkdir(this.publicDir, { recursive: true });
    }
  }

  public async saveImage(base64Data: string, filename: string): Promise<ImageUploadResult> {
    try {
      // Remove data:image/xxx;base64, prefix if present
      const base64Content = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Convert base64 to buffer
      const buffer = Buffer.from(base64Content, 'base64');
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = path.extname(filename) || '.jpg';
      const safeName = path.basename(filename, extension).replace(/[^a-zA-Z0-9-_]/g, '_');
      const uniqueFilename = `${timestamp}_${safeName}${extension}`;
      
      // Ensure directories exist
      await this.ensureDirectories();
      
      // Save to both directories for compatibility
      const uploadPath = path.join(this.uploadDir, uniqueFilename);
      const publicPath = path.join(this.publicDir, uniqueFilename);
      
      await writeFile(uploadPath, buffer);
      await writeFile(publicPath, buffer);
      
      return {
        filename: uniqueFilename,
        path: `/uploads/${uniqueFilename}`,
        size: buffer.length
      };
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save image file');
    }
  }

  public async optimizeImage(buffer: Buffer): Promise<Buffer> {
    // Simple optimization - in production, you might use sharp or similar
    // For now, we'll just return the buffer as-is
    // You can extend this with proper image optimization later
    return buffer;
  }

  public getImageUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}

export const imageManager = ImageManager.getInstance();