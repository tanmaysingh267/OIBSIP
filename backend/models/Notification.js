import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    type: {
      type: String,
      enum: ['low_stock', 'new_order', 'payment_received'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    itemType: String,
    itemName: String,
    currentStock: Number,
    threshold: Number,
    isRead: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
