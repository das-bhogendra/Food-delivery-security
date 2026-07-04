import mongoose from "mongoose";
import { FoodItem } from "../models/food.model";
import { CreateFoodItemDto, UpdateFoodItemDto } from "../dtos/food.dto";

export class FoodItemRepository {
  async create(dto: CreateFoodItemDto) {
    const data = { ...dto, addedBy: new mongoose.Types.ObjectId(dto.addedBy) };
    return await FoodItem.create(data);
  }

  async findAll() {
    return await FoodItem.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await FoodItem.findById(id);
  }

  async findByUser(userId: string) {
    return await FoodItem.find({ addedBy: new mongoose.Types.ObjectId(userId) });
  }

  async findByType(type: string) {
    return await FoodItem.find({ type });
  }

  async update(id: string, dto: UpdateFoodItemDto) {
    return await FoodItem.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    return await FoodItem.findByIdAndDelete(id);
  }
}
