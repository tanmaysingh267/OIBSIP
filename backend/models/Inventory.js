import mongoose from 'mongoose';

const buildNameKey = (value = '') => value.trim().toLowerCase();

const inventorySchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['base', 'sauce', 'cheese', 'vegetable', 'meat'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'itemModel',
      required: false,
    },
    itemModel: {
      type: String,
      enum: ['PizzaBase', 'Sauce', 'Cheese', 'Vegetable', 'Manual'],
      required: false,
    },
    itemName: String,
    nameKey: {
      type: String,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumThreshold: {
      type: Number,
      required: true,
      default: 20,
    },
    lastRestocked: Date,
    reorderQuantity: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

inventorySchema.pre('save', function syncNameKey(next) {
  this.nameKey = buildNameKey(this.itemName || '');
  next();
});

export default mongoose.model('Inventory', inventorySchema);
