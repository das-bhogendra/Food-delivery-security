import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto, UpdateCategoryDto,CreateCategorySchema,UpdateCategorySchema } from "../dtos/category.dto";

const service = new CategoryService();

// ================= CREATE CATEGORY =================
export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id?.toString(); // Convert ObjectId to string

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    console.log("Request body:", req.body);
    const parsed = CreateCategorySchema.safeParse(req.body);
    console.log("Validation:", parsed);

   if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues,
    });
  }

    const dto: CreateCategoryDto = parsed.data;
    const category = await service.createCategory(dto, userId);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= GET ALL CATEGORIES =================
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await service.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= GET CATEGORY BY ID =================
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await service.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= GET CATEGORIES BY USER =================
export const getCategoriesByUser = async (req: Request, res: Response) => {
  try {
    const categories = await service.getCategoriesByUser(req.params.userId);
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= UPDATE CATEGORY =================
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const parsed = UpdateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json({
      success:false,
      message: parsed.error.issues
   });
  }
    const dto: UpdateCategoryDto = parsed.data;

    const category = await service.updateCategory(id, dto); // Pass id and dto separately

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= DELETE CATEGORY =================
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await service.deleteCategory(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
