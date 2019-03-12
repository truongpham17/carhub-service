import mongoose, { Schema } from 'mongoose';

const StoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    totalImportProduct: {
      type: Number,
      default: 0,
    },
    productQuantity: {
      type: Number,
      default: 0,
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

StoreSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      totalImportProduct: this.totalImportProduct,
      productQuantity: this.productQuantity,
    };
  },
};

StoreSchema.statics = {
  createStore(args, userID) {
    return this.create({
      ...args,
      createdBy: userID,
    });
  },
  list({ skip = 0, limit = 50, type } = {}) {
    const queries = { isRemoved: false };
    return this.find(queries)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
};

StoreSchema.index({ name: 'text' });

export default mongoose.model('Store', StoreSchema);
