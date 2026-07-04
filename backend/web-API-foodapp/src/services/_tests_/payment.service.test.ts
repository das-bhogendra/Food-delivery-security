import { PaymentService } from "../payment.service";
import { PaymentRepository, UpdatePaymentDto } from "../../repository/payment.repository";
import { OrderRepository } from "../../repository/order.repository";
import { Order } from "../../models/order.model";
import { Payment } from "../../models/payment.model";
import mongoose from "mongoose";

// ===== MOCK MODELS & REPOSITORIES =====
jest.mock("../../models/order.model");
jest.mock("../../models/payment.model");
jest.mock("../../repository/payment.repository");
jest.mock("../../repository/order.repository");

describe("PaymentService", () => {
  let service: PaymentService;
  let paymentRepo: jest.Mocked<PaymentRepository>;
  let orderRepo: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    service = new PaymentService();
    paymentRepo = new PaymentRepository() as jest.Mocked<PaymentRepository>;
    orderRepo = new OrderRepository() as jest.Mocked<OrderRepository>;

    // Override private repos
    (service as any).paymentRepo = paymentRepo;
    (service as any).orderRepo = orderRepo;

    jest.clearAllMocks();
  });

  // ================= CREATE PAYMENT WITH ORDER =================
  it("should create payment with order", async () => {
    const dto = {
      userId: "507f1f77bcf86cd799439011",
      foodItems: [{ foodId: "507f1f77bcf86cd799439012", name: "Pizza", price: 10, quantity: 2 }],
      totalAmount: 20,
      method: "online" as const,
      transactionId: "txn123",
    };

    const mockOrder = { _id: "order1", ...dto, populate: jest.fn().mockResolvedValue({ _id: "order1" }) };
    const mockPayment = { _id: "payment1", ...dto, populate: jest.fn().mockResolvedValue({ _id: "payment1" }) };

    (Order.create as jest.Mock).mockResolvedValue(mockOrder);
    (Payment.create as jest.Mock).mockResolvedValue(mockPayment);
    (Order.findById as jest.Mock).mockReturnValue({ populate: jest.fn().mockResolvedValue(mockOrder) } as any);
    (Payment.findById as jest.Mock).mockReturnValue({ populate: jest.fn().mockResolvedValue(mockPayment) } as any);

    const result = await service.createPaymentWithOrder(dto);

    expect(Order.create).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalled();
    expect(Order.findById).toHaveBeenCalledWith("order1");
    expect(Payment.findById).toHaveBeenCalledWith("payment1");
    expect(result.order).toEqual(mockOrder);
    expect(result.payment).toEqual(mockPayment);
  });

  // ================= GET PAYMENT BY ORDER =================
  it("should get payment by order", async () => {
    const mockPayment = { _id: "payment1" };
    paymentRepo.findByOrderId.mockResolvedValue(mockPayment as any);

    const result = await service.getPaymentByOrder("order1");

    expect(paymentRepo.findByOrderId).toHaveBeenCalledWith("order1");
    expect(result).toEqual(mockPayment);
  });

  // ================= UPDATE PAYMENT STATUS =================
  it("should update payment status", async () => {
    const dto: UpdatePaymentDto = { status: "success" };
    const mockPayment = { _id: "payment1", status: "success" };
    paymentRepo.updateStatus.mockResolvedValue(mockPayment as any);

    const result = await service.updatePaymentStatus("order1", dto);

    expect(paymentRepo.updateStatus).toHaveBeenCalledWith("order1", dto);
    expect(result).toEqual(mockPayment);
  });

  // ================= GET PAYMENTS BY USER =================
  it("should get payments by user", async () => {
    const mockPayments = [{ _id: "payment1" }];
    paymentRepo.findByUser.mockResolvedValue(mockPayments as any);

    const result = await service.getPaymentsByUser("user1");

    expect(paymentRepo.findByUser).toHaveBeenCalledWith("user1");
    expect(result).toEqual(mockPayments);
  });
});