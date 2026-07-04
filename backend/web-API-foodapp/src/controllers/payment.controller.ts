import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

const service = new PaymentService();

export const createPayment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { foodItems, totalAmount, paymentMethod, transactionId } = req.body;

    if (!foodItems || !totalAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: foodItems, totalAmount, paymentMethod",
      });
    }

    const method = paymentMethod === "online" ? "online" : paymentMethod === "card" ? "card" : "cash_on_delivery";

    const result = await service.createPaymentWithOrder({
      userId: userId.toString(),
      foodItems,
      totalAmount,
      method,
      transactionId,
    });

    res.status(201).json({
      success: true,
      message: "Payment and order created successfully",
      payment: result.payment,
      order: result.order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getPaymentByOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const payment = await service.getPaymentByOrder(orderId);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, transactionId } = req.body;

    if (!status || !["pending", "success", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending', 'success', or 'failed'",
      });
    }

    const payment = await service.updatePaymentStatus(orderId, {
      status,
      transactionId,
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
