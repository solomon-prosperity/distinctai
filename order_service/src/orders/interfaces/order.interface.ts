import { Document } from 'mongoose';

export interface Order extends Document {
  owner_id: string;
  products: string[];
  total_price: number;
  total_quantity: number;
}

export interface UpdateOrderInterface {
  products?: string[];
  total_price?: number;
  total_quantity?: number;
}

export interface GetOrdersInterface {
  page?: number;
  limit?: number;
  owner_id?: string;
  start_date?: string;
  end_date?: string;
  createdAt?: object;
}
