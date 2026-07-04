import { OrderService } from "../order.service";
import { OrderRepository } from "../../repository/order.repository";
import { CreateOrderDto, UpdateOrderDto } from "../../dtos/order.dto";

// ===== MOCK REPOSITORY =====
jest.mock("../../repository/order.repository");

describe("OrderService", () => {
  let service: OrderService;
  let repo: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    repo = new OrderRepository() as jest.Mocked<OrderRepository>;
    service = new OrderService();

    // Override private repo for testing
    (service as any).repo = repo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= CREATE ORDER =================
  it("should create an order", async () => {
    const dto: CreateOrderDto = { userId: "u1", foodItems: ["f1"], status: "pending" };
    const mockOrder = { _id: "1", ...dto, totalAmount: 100, foodItems: [{ foodId: "f1", name: "Pizza", price: 100, quantity: 1 }] };

    repo.create.mockResolvedValue(mockOrder as any);

    const result = await service.createOrder(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrder);
  });

  // ================= GET ALL ORDERS =================
  it("should return all orders", async () => {
    const mockOrders = [{ _id: "1", userId: "u1", foodItems: [], totalAmount: 100, status: "pending" }];
    repo.findAll.mockResolvedValue(mockOrders as any);

    const result = await service.getAllOrders();

    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockOrders);
  });

  // ================= GET ORDER BY ID =================
  it("should return order by id", async () => {
    const mockOrder = { _id: "1", userId: "u1", foodItems: [], totalAmount: 100, status: "pending" };
    repo.findById.mockResolvedValue(mockOrder as any);

    const result = await service.getOrderById("1");

    expect(repo.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockOrder);
  });

  // ================= GET ORDERS BY USER =================
  it("should return orders by user", async () => {
    const mockOrders = [{ _id: "1", userId: "u1", foodItems: [], totalAmount: 100, status: "pending" }];
    repo.findByUser.mockResolvedValue(mockOrders as any);

    const result = await service.getOrdersByUser("u1");

    expect(repo.findByUser).toHaveBeenCalledWith("u1");
    expect(result).toEqual(mockOrders);
  });

  // ================= UPDATE ORDER =================
  it("should update an order", async () => {
    const dto: UpdateOrderDto = { status: "delivered" };
    const mockOrder = { _id: "1", userId: "u1", foodItems: [], totalAmount: 100, status: "delivered" };

    repo.update.mockResolvedValue(mockOrder as any);

    const result = await service.updateOrder("1", dto);

    expect(repo.update).toHaveBeenCalledWith("1", dto);
    expect(result).toEqual(mockOrder);
  });

  // ================= DELETE ORDER =================
  it("should delete an order", async () => {
    const mockOrder = { _id: "1", userId: "u1", foodItems: [], totalAmount: 100, status: "pending" };
    repo.delete.mockResolvedValue(mockOrder as any);

    const result = await service.deleteOrder("1");

    expect(repo.delete).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockOrder);
  });
});