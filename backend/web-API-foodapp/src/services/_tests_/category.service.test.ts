import { CategoryService } from "../category.service";
import { CategoryRepository } from "../../repository/category.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "../../dtos/category.dto";

// ======= MOCK REPOSITORY =======
jest.mock("../../repository/category.repository");

describe("CategoryService", () => {
  let service: CategoryService;
  let repo: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    repo = new CategoryRepository() as jest.Mocked<CategoryRepository>;
    service = new CategoryService();
    
    // Override the private repo for testing
    (service as any).repo = repo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= CREATE CATEGORY =================
  it("should create a category", async () => {
    const dto: CreateCategoryDto = { name: "Food", description: "Food category", addedBy: "user123" };
    const userId = "user123";
    const mockCategory = { _id: "1", ...dto, createdBy: userId };

    repo.create.mockResolvedValue(mockCategory as any);

    const result = await service.createCategory(dto, userId);

    expect(repo.create).toHaveBeenCalledWith(dto, userId);
    expect(result).toEqual(mockCategory);
  });

  // ================= GET ALL CATEGORIES =================
  it("should return all categories", async () => {
    const mockCategories = [{ _id: "1", name: "Food" }];
    repo.findAll.mockResolvedValue(mockCategories as any);

    const result = await service.getAllCategories();

    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  // ================= GET CATEGORY BY ID =================
  it("should return category by id", async () => {
    const mockCategory = { _id: "1", name: "Food" };
    repo.findById.mockResolvedValue(mockCategory as any);

    const result = await service.getCategoryById("1");

    expect(repo.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockCategory);
  });

  // ================= UPDATE CATEGORY =================
  it("should update category", async () => {
    const dto: UpdateCategoryDto = { id: "1", name: "Updated Food", addedBy: "user123" };
    const mockUpdated = { _id: "1", name: "Updated Food", addedBy: "user123" };

    repo.update.mockResolvedValue(mockUpdated as any);

    const result = await service.updateCategory("1", dto);

    expect(repo.update).toHaveBeenCalledWith("1", dto);
    expect(result).toEqual(mockUpdated);
  });

  // ================= DELETE CATEGORY =================
  it("should delete category", async () => {
    const mockCategory = { _id: "1", name: "Food" };
    repo.delete.mockResolvedValue(mockCategory as any);

    const result = await service.deleteCategory("1");

    expect(repo.delete).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockCategory);
  });

});