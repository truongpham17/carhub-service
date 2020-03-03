import mongoose, { Schema } from 'mongoose';

const TestSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

export default mongoose.model('Test', TestSchema);
