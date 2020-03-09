import mongoose, { Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import constants from '../../config/constants';

const TyxSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});
// UserSchema.index({ username: "text" });

export default mongoose.model('TriTest', TyxSchema);
