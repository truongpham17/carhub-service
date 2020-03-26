import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const LogSchema = new Schema(
  {
    type: {
      type: enums.log.type,
      required: true,
    },
    detail: {
      type: Schema.Types.ObjectId,
    },
    note: {
      type: String,
      default: '',
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
