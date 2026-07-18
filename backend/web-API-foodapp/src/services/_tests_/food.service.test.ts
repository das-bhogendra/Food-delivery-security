import { FoodItemService } from "../food.service";
import { FoodItem, IFoodItem } from "../../models/food.model";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Jest globals for TS
declare const jest: any;
declare const describe: any;
declare const it: any;
declare const beforeEach: any;
declare const expect: any;

// ===== MOCK FS & MONGOOSE =====
jest.mock("fs");
jest.mock("../../models/food.model");

describe("FoodItemService", () => {
  let service: FoodItemService;
  let mockFoodItem: jest.Mocked<typeof FoodItem>;

  beforeEach(() => {
    service = new FoodItemService();
    mockFoodItem = FoodItem as jest.Mocked<typeof FoodItem>;
    jest.clearAllMocks();
  });

  // ================= CREATE =================
  it("should create a food item", async () => {
    const dto = { name: "Pizza", type: "Veg", isAvailable: true } as any;
    const userId = "507f1f77bcf86cd799439011";
    const mockReturn = { ...dto, _id: "1", price: 100, isBestSeller: false, isDiscounted: false, addedBy: userId } as any;



    mockFoodItem.create.mockResolvedValue(mockReturn);

    const result = await service.createFoodItem(dto as any, userId);


    expect(mockFoodItem.create).toHaveBeenCalledWith({
      ...dto,
      addedBy: expect.any(mongoose.Types.ObjectId),
    });
    expect(result).toEqual(mockReturn);
  });

  // ================= GET ALL =================
  it("should get all food items", async () => {
    const mockReturn = [{ name: "Pizza" }] as IFoodItem[];
    mockFoodItem.find.mockReturnValue({
      sort: jest.fn().mockReturnValue(mockReturn),
    } as any);

    const result = await service.getAllFoodItems();

    expect(mockFoodItem.find).toHaveBeenCalled();
    expect(result).toEqual(mockReturn);
  });

  // ================= GET BY ID =================
  it("should get food item by id", async () => {
    const mockReturn = { name: "Pizza" } as IFoodItem;
    mockFoodItem.findById.mockResolvedValue(mockReturn);

    const result = await service.getFoodItemById("1");

    expect(mockFoodItem.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockReturn);
  });

  // ================= UPDATE =================
  it("should update food item", async () => {
    const dto = { name: "Burger" };
    const mockReturn = { ...dto, _id: "1", type: "Veg", price: 100, isAvailable: true, isBestSeller: false, isDiscounted: false } as any;
    mockFoodItem.findByIdAndUpdate.mockResolvedValue(mockReturn);

    const result = await service.updateFoodItem("1", dto as any);

    expect(mockFoodItem.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { $set: dto },
      { new: true }
    );
    expect(result).toEqual(mockReturn);
  });

  // ================= DELETE =================
  it("should delete food item", async () => {
    const mockReturn = { name: "Pizza" } as IFoodItem;
    mockFoodItem.findByIdAndDelete.mockResolvedValue(mockReturn);

    const result = await service.deleteFoodItem("1");

    expect(mockFoodItem.findByIdAndDelete).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockReturn);
  });

  // ================= FILE UPLOAD =================
  it("should upload food photo", async () => {
    const file: any = { originalname: "test.jpg", buffer: Buffer.from("data") };
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const result = await service.uploadFoodPhoto(file);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(result).toContain("/uploads/food_photos/");
  });

  it("should upload food video", async () => {
    const file: any = { originalname: "video.mp4", buffer: Buffer.from("data") };
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const result = await service.uploadFoodVideo(file);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(result).toContain("/uploads/food_videos/");
  });

  // ================= BEST SELLER =================
  it("should get best seller food items", async () => {
    const mockReturn = [{ name: "Pizza", isBestSeller: true }] as IFoodItem[];
    mockFoodItem.find.mockReturnValue({
      sort: jest.fn(),
    } as any);
    mockFoodItem.find.mockResolvedValue(mockReturn as any);

    const result = await service.getBestSellerFoodItems();
    expect(result).toEqual(mockReturn);
  });

  // ================= DISCOUNTED =================
  it("should get discounted food items", async () => {
    const mockReturn = [{ name: "Pizza", isDiscounted: true }] as IFoodItem[];
    mockFoodItem.find.mockResolvedValue(mockReturn as any);

    const result = await service.getDiscountedFoodItems();
    expect(result).toEqual(mockReturn);
  });
});