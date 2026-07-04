// app/lib/orderApi.ts
import { API } from "./api/endpoints";
import axios from "./api/axios";
import { OrderResponseDto, CreateOrderDto, UpdateOrderDto } from "@/app/dtos/order.dto";
import { mapOrder } from "@/app/utils/orderMapper";

export const orderApi = {
  // User creates order - sends items array with foodId, name, quantity, price
  create: async (dto: CreateOrderDto): Promise<OrderResponseDto> => {
    const res = await axios.post(API.USER.ORDER.CREATE, dto, { withCredentials: true });
    return mapOrder(res.data.data);
  },

  // Admin fetches all orders
  getAll: async (): Promise<OrderResponseDto[]> => {
    const res = await axios.get(API.ADMIN.ORDER.GET_ALL, { withCredentials: true });
    return res.data.data.map(mapOrder);
  },

  // User fetches own orders
  getAllUserOrders: async (userId: string): Promise<OrderResponseDto[]> => {
    const res = await axios.get(`${API.USER.ORDER.GET_USER_ORDERS}${userId}`, { withCredentials: true });
    return res.data.data.map(mapOrder);
  },

  getById: async (id: string): Promise<OrderResponseDto> => {
    const res = await axios.get(`${API.USER.ORDER.GET_BY_ID}${id}`, { withCredentials: true });
    return mapOrder(res.data.data);
  },

  update: async (id: string, dto: UpdateOrderDto): Promise<OrderResponseDto> => {
    const res = await axios.put(`${API.ADMIN.ORDER.UPDATE}${id}`, dto, { withCredentials: true });
    return mapOrder(res.data.data);
  },

  delete: async (id: string): Promise<boolean> => {
    const res = await axios.delete(`${API.ADMIN.ORDER.DELETE}${id}`, { withCredentials: true });
    return res.data.success;
  },
};