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
    fromDate: {
      type: Date,
      default: Date.now(),
    },
    toDate: {
      type: Date,
      default: null,
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
    sharingRequest: {
      type: Schema.Types.ObjectId,
      ref: 'RentalSharingRequest',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Sharing', sharingSchema);
