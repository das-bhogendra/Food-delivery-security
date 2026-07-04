import mongoose from "mongoose";
import { Payment, IPayment } from "../models/payment.model";
import { Order } from "../models/order.model";

export interface CreatePaymentDto {
  userId: string;
  orderId?: string;
  amount: number;
  method: "card" | "online" | "cash_on_delivery";
  transactionId?: string;
}

export interface UpdatePaymentDto {
  status: "pending" | "success" | "failed";
  transactionId?: string;
}

export class PaymentRepository {
  async create(dto: CreatePaymentDto) {
    const payment = await Payment.create({
      userId: new mongoose.Types.ObjectId(dto.userId),
      orderId: dto.orderId ? new mongoose.Types.ObjectId(dto.orderId) : undefined,
      amount: dto.amount,
      method: dto.method,
      status: dto.method === "cash_on_delivery" ? "pending" : "pending",
      transactionId: dto.transactionId,
      paidAt: dto.method !== "cash_on_delivery" ? new Date() : undefined,
    });

    await payment.populate("userId", "name email");
    await payment.populate("orderId");

    return payment;
  }

  async findByOrderId(orderId: string) {
    const payment = await Payment.findOne({ orderId: new mongoose.Types.ObjectId(orderId) })
      .populate("userId", "name email")
      .populate("orderId");
    return payment;
  }

  async findById(id: string) {
    const payment = await Payment.findById(id)
      .populate("userId", "name email")
      .populate("orderId");
    return payment;
  }

  async updateStatus(orderId: string, dto: UpdatePaymentDto) {
    const payment = await Payment.findOneAndUpdate(
      { orderId: new mongoose.Types.ObjectId(orderId) },
      {
        status: dto.status,
        ...(dto.transactionId && { transactionId: dto.transactionId }),
        ...(dto.status === "success" && { paidAt: new Date() }),
      },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("orderId");

    return payment;
  }

  async findByUser(userId: string) {
    const payments = await Payment.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("userId", "name email")
      .populate("orderId")
      .sort({ createdAt: -1 });
    return payments;
  }
}
