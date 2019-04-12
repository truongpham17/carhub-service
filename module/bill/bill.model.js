import mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const BillSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
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

BillSchema.pre('save', function (next) {
  if (this.isNew) {
    billModel.count().then(res => {
      this._id = res.toString().padStart(5, "0");
      next();
    });
  } else {
    next();
  }
})

BillSchema.methods = {
  toDetailJSON() {
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
      createdAt: this.createdAt,
      paymentStatus: this.totalPaid >= this.totalPrice ? 'paid' : 'indebted',
    };
  },
  toJSON() {
    return {
      _id: this._id,
      totalPrice: this.totalPrice,
      createdAt: this.createdAt,
      paymentStatus: this.totalPaid >= this.totalPrice ? 'paid' : 'indebted',
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
      // .populate('productList.product productList.product.store')
      .populate({
        path: 'productList.product',
        populate: {
          path: 'store',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
};

const billModel = mongoose.model('Bill', BillSchema);

export default billModel;
