import mongoose, { Schema } from 'mongoose';

const sharingSchema = new Schema(
  {
    rental: {
      type: Schema.Types.ObjectId,
      ref: 'Rental',
      default: null,
    },
    geometry: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    address: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    listRentalRequest: {
      type: [
        {
          customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            default: null,
          },
          message: {
            type: String,
            default: '',
          },
          isAccepted: {
            type: Boolean,
            default: false,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Sharing', sharingSchema);
