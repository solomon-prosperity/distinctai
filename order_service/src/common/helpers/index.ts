import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import axios from 'axios';
import { promisify } from 'util';
import mongoose from 'mongoose';
import {
  PaginationResultInterface,
  ErrorsInterface,
  PhoneNumberInterface,
} from '../utils/interfaces';
import { ValidationError } from '@nestjs/common';

export const paginateResult = (
  total_count: number,
  current_page: number,
  limit: number,
): PaginationResultInterface => {
  const has_next_page = total_count > Number(current_page) * limit;
  const has_prev_page = Number(current_page) > 1;
  const total_pages = Math.ceil(total_count / limit);
  const out_of_range = current_page > total_pages;

  return {
    count: !out_of_range
      ? Math.min(limit, total_count - (current_page - 1) * limit)
      : 0,
    total_count,
    current_page: Number(current_page),
    prev_page: has_prev_page ? Number(current_page) - 1 : null,
    next_page: has_next_page ? Number(current_page) + 1 : null,
    total_pages,
    out_of_range,
  };
};

export const formatErrorMessages = (
  errors: ErrorsInterface,
  message: string,
): string[] => {
  let $errors: string[] = [];

  if (Array.isArray(errors) && errors.length === 0) {
    $errors.push(message);
    return $errors;
  }

  if (Array.isArray(errors.message)) {
    errors.message.forEach((e) => {
      $errors = e.errors;
    });
    return $errors;
  }

  $errors.push(errors.message);

  return $errors;
};

export const formatPhonenumber = (
  phone_number: PhoneNumberInterface,
): string => {
  const { country_code, phone } = phone_number;
  let code = country_code;
  if (!country_code.startsWith('+')) {
    code = `+${country_code}`;
  }
  return `${code}${phone}`;
};

export const writeBufferToFile = async (
  buffer: Buffer,
  filename: string,
  directory: string,
): Promise<string> => {
  const writeFileAsync = promisify(fs.writeFile);
  // Ensure the directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Generate full file path
  const filePath = path.join(directory, filename);

  try {
    // Write the buffer to the file
    await writeFileAsync(filePath, buffer);
    return filePath; // Return the path of the saved file
  } catch (error) {
    throw new Error(`Failed to write buffer to file: ${error.message}`);
  }
};

export const getFileBufferFromUrl = async (
  fileUrl: string,
): Promise<string> => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer', // Ensures the response is returned as a Buffer
    });

    const base64String = Buffer.from(response.data).toString('base64');

    return base64String;
  } catch (error) {
    throw new Error(`Failed to download file from URL: ${error.message}`);
  }
};

export const convertToYYYYMMDD = (isoDate: string) => {
  const date = moment(isoDate);
  return date.format('YYYY-MM-DD');
};

export const isValidMongooseId = (documentId: string) => {
  return mongoose.Types.ObjectId.isValid(documentId);
};

export const formatValidationError = (error: ValidationError) => {
  const formatted = [];

  if (error.constraints) {
    formatted.push({
      field: error.property,
      errors: Object.values(error.constraints),
    });
  }

  if (error.children && error.children.length > 0) {
    error.children.forEach((childError) => {
      formatted.push(...formatValidationError(childError));
    });
  }

  return formatted;
};
