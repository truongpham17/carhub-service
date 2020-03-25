import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const LogSchema = new Schema(
  {
    type: {
      type: enums.log.type,
      required: true,
    },
    detail: {
      type: String,
    },
    note: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    title: {
      type: enums.logTitle.type,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Log', LogSchema);
