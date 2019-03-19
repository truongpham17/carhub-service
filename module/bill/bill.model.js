import mongoose, { Schema } from 'mongoose';

const BillSchema = new Schema(
  {
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    otherCost: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    productList: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 0,
        },
        discount: {
          type: Number,
          default: 0,
        },
        isReturned: {
          type: Boolean,
          default: false,
        },
      },
    ],
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

BillSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      totalQuantity: this.totalQuantity,
      totalPrice: this.totalPrice,
      totalPaid: this.totalPaid,
      otherCost: this.otherCost,
      note: this.note,
      productList: this.productList,
      customer: this.customer,
      createdBy: this.createdBy,
    };
  },
};

BillSchema.statics = {
  createBill(args, userID) {
    return this.create({
      ...args,
      createdBy: userID,
    });
  },
  list({ skip = 0, limit = 50 } = {}) {
    const queries = { isRemoved: false };
    return this.find(queries)
      .populate('productList.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
};

export default mongoose.model('Bill', BillSchema);
