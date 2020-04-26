import mongoose, { Schema } from 'mongoose';

const NotificaionSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
    },
    actor: {
      type: Schema.Types.ObjectId,
    },
    detail: {
      type: [
        {
          detailType: String,
          value: String,
        },
      ],
    },
    navigatorData: {
      type: {
        screenName: String,
        selectedId: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificaionSchema);
