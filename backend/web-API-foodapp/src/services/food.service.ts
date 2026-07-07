import { FoodItem, IFoodItem } from "../models/food.model";
import { CreateFoodItemDto, UpdateFoodItemDto } from "../dtos/food.dto";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export class FoodItemService {
  // ================= CREATE =================
  async createFoodItem(
  dto: CreateFoodItemDto,
  userId: string
): Promise<IFoodItem> {
  return await FoodItem.create({
    ...dto,
    addedBy: new mongoose.Types.ObjectId(userId),
  });
}

  // ================= GET =================
  async getAllFoodItems(): Promise<IFoodItem[]> {
    return await FoodItem.find().sort({ createdAt: -1 }) as IFoodItem[];
  }

  async getFoodItemById(id: string): Promise<IFoodItem | null> {
    return await FoodItem.findById(id) as IFoodItem | null;
  }

  async getFoodItemsByType(type: string): Promise<IFoodItem[]> {
    return await FoodItem.find({ type }).sort({ createdAt: -1 }) as IFoodItem[];
  }

  async getFoodItemsByUser(userId: string): Promise<IFoodItem[]> {
    return await FoodItem.find({ addedBy: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 }) as IFoodItem[];
  }

  // ================= UPDATE =================
  async updateFoodItem(id: string, dto: UpdateFoodItemDto): Promise<IFoodItem | null> {
    const updatedItem = await FoodItem.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    ) as IFoodItem | null;

    return updatedItem;
  }

  // ================= DELETE =================
  async deleteFoodItem(id: string): Promise<IFoodItem | null> {
    return await FoodItem.findByIdAndDelete(id) as IFoodItem | null;
  }

  // ================= MEDIA UPLOAD =================
  async uploadFoodPhoto(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join(__dirname, "../../uploads/food_photos");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadPath, filename);

    fs.writeFileSync(filepath, file.buffer);
    return `/uploads/food_photos/${filename}`; // return relative path for frontend
  }

  async uploadFoodVideo(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join(__dirname, "../../uploads/food_videos");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadPath, filename);

    fs.writeFileSync(filepath, file.buffer);
    return `/uploads/food_videos/${filename}`; // return relative path for frontend
  }

  // ================= BEST SELLER =================
  async getBestSellerFoodItems(): Promise<IFoodItem[]> {
    return await FoodItem.find({ isBestSeller: true }) as IFoodItem[];
  }

  // ================= DISCOUNTED =================
  async getDiscountedFoodItems(): Promise<IFoodItem[]> {
    return await FoodItem.find({ isDiscounted: true }) as IFoodItem[];
  }
}
