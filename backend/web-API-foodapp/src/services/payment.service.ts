import mongoose from "mongoose";
import { PaymentRepository, CreatePaymentDto, UpdatePaymentDto } from "../repository/payment.repository";
import { OrderRepository } from "../repository/order.repository";
import { IOrderFoodItem } from "../models/order.model";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";

export class PaymentService {
  private paymentRepo = new PaymentRepository();
  private orderRepo = new OrderRepository();

  async createPaymentWithOrder(dto: {
    userId: string;
    foodItems: Array<{
      foodId: string;
      name: string;
      price: number;
      imageUrl?: string;
      quantity: number;
    }>;
    totalAmount: number;
    method: "card" | "online" | "cash_on_delivery";
    transactionId?: string;
  }) {
    const orderFoodItems: IOrderFoodItem[] = dto.foodItems.map(item => ({
      foodId: new mongoose.Types.ObjectId(item.foodId),
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    }));

    const newOrder = await Order.create({
      userId: new mongoose.Types.ObjectId(dto.userId),
      foodItems: orderFoodItems,
      totalAmount: dto.totalAmount,
      status: "pending",
    });

    const payment = await Payment.create({
      userId: new mongoose.Types.ObjectId(dto.userId),
      orderId: newOrder._id,
      amount: dto.totalAmount,
      method: dto.method,
      status: dto.method === "cash_on_delivery" ? "pending" : "success",
      transactionId: dto.transactionId,
      paidAt: dto.method !== "cash_on_delivery" ? new Date() : undefined,
    });

    const populatedOrder = await Order.findById(newOrder._id).populate("userId", "name email");
    const populatedPayment = await Payment.findById(payment._id).populate("userId", "name email");

    return { order: populatedOrder, payment: populatedPayment };
  }

  async getPaymentByOrder(orderId: string) {
    return await this.paymentRepo.findByOrderId(orderId);
  }

  async updatePaymentStatus(orderId: string, dto: UpdatePaymentDto) {
    return await this.paymentRepo.updateStatus(orderId, dto);
  }

  async getPaymentsByUser(userId: string) {
    return await this.paymentRepo.findByUser(userId);
  }
}
