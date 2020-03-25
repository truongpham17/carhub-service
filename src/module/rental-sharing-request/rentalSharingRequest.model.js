import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const listSharingSchema = new Schema(
  {
    sharing: {
      type: Schema.Types.ObjectId,
      ref: 'Sharing',
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: enums.listSharingRequest.status,
      default: 'PENDING',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('listSharingRequest', listSharingSchema);
