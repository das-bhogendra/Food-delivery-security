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
      data: order, 
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
    
      orders = await service.getOrdersByUser(userId);
    } else {
    
      orders = await service.getAllOrders();
    }

    res.status(200).json({ success: true, data: orders }); 
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await service.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const requesterId = req.user?._id?.toString();
    const orderOwnerId = (order.userId as any)?._id?.toString() || order.userId?.toString();
    const isAdmin = req.user?.role === "admin";

    if (orderOwnerId !== requesterId && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, data: order });
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


export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const existingOrder = await service.getOrderById(req.params.id);
    if (!existingOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    const requesterId = req.user?._id?.toString();
    const orderOwnerId = (existingOrder.userId as any)?._id?.toString() || existingOrder.userId?.toString();
    const isAdmin = req.user?.role === "admin";

    if (orderOwnerId !== requesterId && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const deleted = await service.deleteOrder(req.params.id);

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
