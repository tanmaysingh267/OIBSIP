import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        baseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PizzaBase',
        },
        sauceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Sauce',
        },
        cheeseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Cheese',
        },
        vegetables: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vegetable',
          },
        ],
        customizations: {
          size: {
            id: String,
            name: String,
            price: Number,
            description: String,
          },
          base: {
            id: String,
            name: String,
            price: Number,
            description: String,
          },
          sauce: {
            id: String,
            name: String,
            description: String,
          },
          cheese: {
            id: String,
            name: String,
            price: Number,
            description: String,
          },
          veggies: [
            {
              id: String,
              name: String,
              price: Number,
            },
          ],
          nonVeg: [
            {
              id: String,
              name: String,
              price: Number,
            },
          ],
          quantity: Number,
          estimatedDeliveryTime: String,
        },
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'order_received', 'in_kitchen', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash'],
      required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    estimatedDeliveryTime: Date,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
