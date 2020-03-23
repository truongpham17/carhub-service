import mongoose, { Schema } from 'mongoose';

const TransferSchema = new Schema(
  {
    fromHub: {
      type: Schema.Types.ObjectId,
      ref: 'Hub',
    },
    toHub: {
      type: Schema.Types.ObjectId,
      ref: 'Hub',
    },
    date: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: 'true',
    },
    listCar: {
      type: [
        {
          carID: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
          },
          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Transfer', TransferSchema);
