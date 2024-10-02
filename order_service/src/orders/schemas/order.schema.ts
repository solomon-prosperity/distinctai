import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2'; // Full documentation here - https://www.npmjs.com/package/mongoose-paginate-v2
import { Order } from '../entities/order.entity';

mongoosePaginate.paginate.options = {
  limit: 20,
  useEstimatedCount: false,
  customLabels: {
    totalDocs: 'totalDocs',
    docs: 'docs',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPages',
    pagingCounter: 'serialNo',
    meta: 'pagination',
  },
};

const productsSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      retainKeyOrder: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

export const OrderSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        type: productsSchema,
        required: true,
      },
    ],
    total_quantity: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      retainKeyOrder: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);
// eslint-disable-next-line func-names
OrderSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};

// add pagination plugin
OrderSchema.plugin(mongoosePaginate);
// Load business rules to models
OrderSchema.loadClass(Order);
