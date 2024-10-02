import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2'; // Full documentation here - https://www.npmjs.com/package/mongoose-paginate-v2
import { Product } from '../entities/product.entity';

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

export const ProductSchema = new mongoose.Schema(
  {
    owner_id: {
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
    owner_details: {
      type: Object,
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
ProductSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};

// add pagination plugin
ProductSchema.plugin(mongoosePaginate);
// Load business rules to models
ProductSchema.loadClass(Product);
