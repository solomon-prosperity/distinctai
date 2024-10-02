import { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  owner_id: string;
  owner_details: object;
  price: number;
}

export interface UpdateProductInterface {
  name?: string;
  description?: string;
  price?: number;
  owner_details?: object;
}

export interface GetProductsInterface {
  page?: number;
  limit?: number;
  owner_id?: string;
  start_date?: string;
  end_date?: string;
  createdAt?: object;
}
