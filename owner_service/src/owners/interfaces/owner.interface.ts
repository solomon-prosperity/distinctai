import { Document } from 'mongoose';

export interface PhoneNumberInterface {
  country_code: string;
  phone: string;
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

export interface UpdateOwnerInterface {
  address?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  password?: string;
  password_changed_at?: number;
  status?: string;
  otp?: string;
  otp_expires_at?: number;
  login_attempts?: number;
  login_times?: string[];
  phone_number?: PhoneNumberInterface;
  reset_password_token?: string;
  reset_password_token_expires?: number;
}

export interface CreateOwnerInterface {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  gender?: string;
  phone_number: PhoneNumberInterface;
  date_of_birth: string;
  password: string;
}

export interface GetOwnersInterface {
  page?: number;
  limit?: number;
}
