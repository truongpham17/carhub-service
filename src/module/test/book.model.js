import mongoose, { Schema } from 'mongoose';

const CuongSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

export default mongoose.model('CuongSchemma', CuongSchema);
