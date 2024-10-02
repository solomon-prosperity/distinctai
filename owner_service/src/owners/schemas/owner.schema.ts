import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2'; // Full documentation here - https://www.npmjs.com/package/mongoose-paginate-v2
import { Owner } from '../entities/owner.entity';

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

const phoneNumberSchema = new mongoose.Schema({
  country_code: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

export const OwnerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
    },
    phone_number: {
      type: phoneNumberSchema,
      required: true,
    },
    password: {
      type: String,
    },
    date_of_birth: {
      type: Date,
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
OwnerSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};
OwnerSchema.index({ email: 1 });

// add pagination plugin
OwnerSchema.plugin(mongoosePaginate);
// Load business rules to models
OwnerSchema.loadClass(Owner);
