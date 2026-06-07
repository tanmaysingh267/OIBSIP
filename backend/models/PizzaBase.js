import mongoose from 'mongoose';

const pizzaBaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PizzaBase', pizzaBaseSchema);
