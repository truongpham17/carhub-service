import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { compareSync, hashSync } from "bcrypt-nodejs";
import constants from "../../config/constants";

const CustomerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [2, "Username must equal or longer than 2"],
      maxlength: [40, "Username must equal or shorter than 20"]
    },
    phone: String,
    address: String,
    debt: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

CustomerSchema.methods = {
  toJSON() {
    return {
      username: this.username,
      phone: this.phone,
      address: this.address,
      debt: this.debt
    };
  },
};


export default mongoose.model("Customer", CustomerSchema);
