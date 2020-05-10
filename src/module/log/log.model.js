import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const LogSchema = new Schema(
  {
    type: {
      // type: enums.log.type,
      type: String,
      required: true,
    },
    title: {
      // type: enums.logTitle.type,
      type: String,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Log', LogSchema);
