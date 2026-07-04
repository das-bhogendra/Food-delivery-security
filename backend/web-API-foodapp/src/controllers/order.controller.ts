import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";

const service = new OrderService();

// ================= CREATE ORDER =================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const dto: CreateOrderDto = {
      ...req.body,
      userId: userId.toString(),
    };

    const order = await service.createOrder(dto);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order, // ✅ order with populated foodItems and userId
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= GET ALL ORDERS (Admin) OR FILTER BY USER =================
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    let orders;
    if (userId) {
      // If userId query parameter is provided, filter orders by userId
      orders = await service.getOrdersByUser(userId);
    } else {
      // Otherwise, return all orders (admin use)
      orders = await service.getAllOrders();
    }

    res.status(200).json({ success: true, data: orders }); // ✅ populated
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ================= GET ORDER BY ID =================
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await service.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order }); // ✅ populated foodItems
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const orders = await service.getOrdersByUser(userId);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= UPDATE ORDER =================
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    // Only allow updating status
    if (!status || !["pending", "confirmed", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await service.updateOrder(req.params.id, { status });

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// ================= DELETE ORDER =================
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await service.deleteOrder(req.params.id);

    if (!deleted) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
