import { Document } from 'mongoose';
import { Observable } from 'rxjs';

export interface ResponseMessageInterface {
  status_code: number;
  message: Array<string>;
  data: object;
}

export interface QueueTopologyInterface {
  queue: string;
  exchange: string;
  routing_key: string;
}

export interface MessageInterface {
  action: string;
  type: string;
  data: object;
}

export interface MessagePublisherInterface {
  worker: string;
  message: MessageInterface;
}

export interface ErrorMessagesInterface {
  field: string;
  errors: Array<string>;
}

export interface ErrorsInterface {
  message: Array<ErrorMessagesInterface>;
}

export interface PaginationResultInterface {
  count: number;
  total_count: number;
  prev_page: number | null;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  out_of_range: boolean;
}

export interface ResponseInterface {
  response?: {
    pagination?: PaginationResultInterface;
    docs?: Array<object>;
  };
  message?: string;
}

export interface PhoneNumberInterface {
  country_code: string;
  phone: string;
}

export interface PerformKYCInterface {
  type: string;
  value: string;
  is_id_image: boolean;
  first_name: string;
  last_name: string;
  dob: string;
  state?: string;
  lga?: string;
}

export interface IdentityPassPayloadInterface {
  number?: string;
  vehicle_number?: string;
  image?: string;
  id_image_url?: string;
  number_nin?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  state?: string;
  lga?: string;
}

export interface Owner extends Document {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  gender: string;
  phone_number: PhoneNumberInterface;
  date_of_birth: string;
  password: string;
}

export interface IRMQMessage {
  action: string;
  type: string;
  data: object;
}

export interface IOwnerServiceGrpcMethods {
  getOwner(data: { id: string }): Observable<any>;
  validateToken(data: { token: string }): Observable<any>;
}
