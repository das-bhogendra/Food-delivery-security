import { Category } from "../models/category.model";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";

export class CategoryRepository {
  async create(data: CreateCategoryDto, userId: string) {
    return await Category.create({
      ...data,
      createdBy: userId,
    });
  }

  async findAll() {
    return await Category.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await Category.findById(id);
  }

  async findByUser(userId: string) {
    return await Category.find({ createdBy: userId }).sort({ createdAt: -1 });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await Category.findByIdAndDelete(id);
  }
}
