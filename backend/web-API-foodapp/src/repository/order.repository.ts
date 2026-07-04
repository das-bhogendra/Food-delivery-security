import mongoose from "mongoose";
import { Order, IOrder, IOrderFoodItem } from "../models/order.model";
import { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";
import { FoodItem } from "../models/food.model";

export class OrderRepository {
  // ================= CREATE ORDER =================
  async create(dto: CreateOrderDto) {
    const foodDocs = await FoodItem.find({ _id: { $in: dto.foodItems } });
    if (!foodDocs || foodDocs.length === 0) {
      throw new Error("No valid food items found");
    }

    const orderFoodItems: IOrderFoodItem[] = foodDocs.map(item => ({
      foodId: item._id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: 1,
    }));

    const totalAmount = orderFoodItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(dto.userId),
      foodItems: orderFoodItems,
      totalAmount,
      status: dto.status || "pending",
    });

    // Safe populate
    await order.populate("userId", "name email");

    // Ensure userId is not null
    const user = order.userId ? order.userId : { _id: '', name: '', email: '' };

    return {
      ...order.toObject(),
      userId: user,
    };
  }

  // ================= UPDATE ORDER =================
  async update(id: string, dto: UpdateOrderDto) {
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (dto.userId) order.userId = new mongoose.Types.ObjectId(dto.userId);

    if (dto.foodItems && dto.foodItems.length > 0) {
      const foodDocs = await FoodItem.find({ _id: { $in: dto.foodItems } });
      const orderFoodItems: IOrderFoodItem[] = foodDocs.map(item => ({
        foodId: item._id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      }));
      order.foodItems = orderFoodItems;
      order.totalAmount = orderFoodItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    if (dto.status) order.status = dto.status;
    if (dto.notes !== undefined) order.notes = dto.notes;

    await order.save();
    await order.populate("userId", "name email");
    const user = order.userId ? order.userId : { _id: '', name: '', email: '' };
    return {
      ...order.toObject(),
      userId: user,
    };
  }

  // ================= GET ALL ORDERS =================
  async findAll() {
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    return orders.map(order => {
      const user = order.userId ? order.userId : { _id: '', name: '', email: '' };
      return {
        ...order.toObject(),
        userId: user,
      };
    });
  }

  // ================= GET ORDER BY ID =================
  async findById(id: string) {
    const order = await Order.findById(id).populate("userId", "name email");
    if (!order) return null;
    const user = order.userId ? order.userId : { _id: '', name: '', email: '' };
    return {
      ...order.toObject(),
      userId: user,
    };
  }

  // ================= GET ORDERS BY USER =================
  async findByUser(userId: string) {
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return orders.map(order => {
      const user = order.userId ? order.userId : { _id: '', name: '', email: '' };
      return {
        ...order.toObject(),
        userId: user,
      };
    });
  }

  // ================= DELETE ORDER =================
  async delete(id: string) {
    return await Order.findByIdAndDelete(id);
  }
}
