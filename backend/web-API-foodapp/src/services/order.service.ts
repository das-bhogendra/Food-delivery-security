import { OrderRepository } from "../repository/order.repository";
import { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";

export class OrderService {
  private repo = new OrderRepository();

  async createOrder(dto: CreateOrderDto) {
    return await this.repo.create(dto);
  }

  async getAllOrders() {
    return await this.repo.findAll();
  }

  async getOrderById(id: string) {
    return await this.repo.findById(id);
  }

  async getOrdersByUser(userId: string) {
    return await this.repo.findByUser(userId);
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    return await this.repo.update(id, dto);
  }

  async deleteOrder(id: string) {
    return await this.repo.delete(id);
  }
}
