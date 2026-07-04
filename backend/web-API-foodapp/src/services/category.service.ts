import { CategoryRepository } from "../repository/category.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";

export class CategoryService {
  private repo = new CategoryRepository();

  // ================= CREATE CATEGORY =================
  async createCategory(dto: CreateCategoryDto, userId: string) {
    // Directly pass dto and userId to repository
    return this.repo.create(dto, userId);
  }

  // ================= GET ALL CATEGORIES =================
  async getAllCategories() {
    return this.repo.findAll();
  }

  // ================= GET CATEGORY BY ID =================
  async getCategoryById(id: string) {
    return this.repo.findById(id);
  }

  // ================= GET CATEGORIES BY USER =================
  async getCategoriesByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  // ================= UPDATE CATEGORY =================
  async updateCategory(id: string, dto: UpdateCategoryDto) {
    return this.repo.update(id, dto);
  }

  // ================= DELETE CATEGORY =================
  async deleteCategory(id: string) {
    return this.repo.delete(id);
  }
}
