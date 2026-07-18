import { API } from "./api/endpoints";
import axios from "./api/axios";

export interface PaymentMethod {
  id: string;
  type: "card" | "esewa" | "imepay" | "connectips" | "cod";
  last4?: string;
  expiryDate?: string;
  isDefault?: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentRequest {
  foodItems: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  transactionId?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  orderId?: string;
  payment?: any;
  order?: any;
}

export const paymentApi = {
  processPayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    const res = await axios.post("/api/payment/create", request, {
      withCredentials: true,
    });
    return res.data;
  },




  getPaymentByOrder: async (orderId: string): Promise<any> => {
    const res = await axios.get(`/api/payment/${orderId}`, { withCredentials: true });
    return res.data;
  },

  updatePaymentStatus: async (orderId: string, status: string, transactionId?: string): Promise<PaymentResponse> => {
    const res = await axios.put(`/api/payment/${orderId}/status`, { status, transactionId }, { withCredentials: true });
    return res.data;
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const res = await axios.get("/api/payment/methods", { withCredentials: true });
    return res.data.data;
  },

  savePaymentMethod: async (method: Omit<PaymentMethod, "id">): Promise<PaymentMethod> => {
    const res = await axios.post("/api/payment/methods", method, { withCredentials: true });
    return res.data.data;
  },

  deletePaymentMethod: async (id: string): Promise<boolean> => {
    const res = await axios.delete(`/api/payment/methods/${id}`, { withCredentials: true });
    return res.data.success;
  },
};
