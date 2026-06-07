import Inventory from '../models/Inventory.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../config/email.js';
import PizzaBase from '../models/PizzaBase.js';
import Sauce from '../models/Sauce.js';
import Cheese from '../models/Cheese.js';
import Vegetable from '../models/Vegetable.js';

const buildNameKey = (value = '') => value.trim().toLowerCase();
const getDefaultThreshold = (itemType) => {
  const map = {
    base: Number(process.env.STOCK_THRESHOLD_BASE) || 20,
    sauce: Number(process.env.STOCK_THRESHOLD_SAUCE) || 20,
    cheese: Number(process.env.STOCK_THRESHOLD_CHEESE) || 20,
    vegetable: Number(process.env.STOCK_THRESHOLD_VEGGIES) || 30,
    meat: Number(process.env.STOCK_THRESHOLD_MEAT) || 20,
  };

  return map[itemType] || 20;
};

const catalogSources = [
  { itemType: 'base', itemModel: 'PizzaBase', model: PizzaBase },
  { itemType: 'sauce', itemModel: 'Sauce', model: Sauce },
  { itemType: 'cheese', itemModel: 'Cheese', model: Cheese },
  { itemType: 'vegetable', itemModel: 'Vegetable', model: Vegetable },
];

// Get all inventory items
export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ itemType: 1, itemName: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

// Add inventory item
export const addInventoryItem = async (req, res) => {
  try {
    const { itemType, itemId, itemModel, itemName, quantity, minimumThreshold, reorderQuantity } =
      req.body;

    if (!itemType || !itemName) {
      return res.status(400).json({ message: 'Item type and item name are required' });
    }

    const existingItem = itemId
      ? await Inventory.findOne({ itemId })
      : await Inventory.findOne({ itemType, nameKey: buildNameKey(itemName) });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in inventory' });
    }

    const inventory = new Inventory({
      itemType,
      itemId: itemId || undefined,
      itemModel: itemModel || 'Manual',
      itemName,
      quantity: Number(quantity) || 0,
      minimumThreshold: Number(minimumThreshold) || getDefaultThreshold(itemType),
      reorderQuantity: Number(reorderQuantity) || 25,
      lastRestocked: new Date(),
    });

    await inventory.save();
    res.status(201).json({ message: 'Inventory item added', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory item', error: error.message });
  }
};

// Update inventory quantity
export const updateInventoryQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      itemId,
      { quantity: Number(quantity), lastRestocked: new Date() },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Check if stock is below threshold
    if (inventory.quantity <= inventory.minimumThreshold) {
      const notification = new Notification({
        adminId: req.admin.id,
        type: 'low_stock',
        message: `Low stock: ${inventory.itemName}`,
        itemType: inventory.itemType,
        itemName: inventory.itemName,
        currentStock: inventory.quantity,
        threshold: inventory.minimumThreshold,
      });

      await notification.save();

      // Send email notification
      await sendEmail(
        process.env.ADMIN_EMAIL,
        'Low Stock Alert - Pizza Delivery',
        `<h2>Low Stock Alert</h2>
         <p>Item: ${inventory.itemName}</p>
         <p>Current Stock: ${inventory.quantity}</p>
         <p>Minimum Threshold: ${inventory.minimumThreshold}</p>`
      );
    }

    res.json({ message: 'Inventory updated', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory', error: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$minimumThreshold'] },
    });

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock items', error: error.message });
  }
};

// Get inventory statistics
export const getInventoryStats = async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: '$itemType',
          totalQuantity: { $sum: '$quantity' },
          itemCount: { $sum: 1 },
          averageQuantity: { $avg: '$quantity' },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory stats', error: error.message });
  }
};

export const syncInventoryCatalog = async (req, res) => {
  try {
    const createdItems = [];

    for (const source of catalogSources) {
      const items = await source.model.find();

      for (const item of items) {
        const existing = await Inventory.findOne({ itemId: item._id });

        if (existing) {
          if (!existing.nameKey) {
            existing.itemName = existing.itemName || item.name;
            existing.nameKey = buildNameKey(existing.itemName);
            await existing.save();
          }
          continue;
        }

        const inventory = new Inventory({
          itemType: source.itemType,
          itemId: item._id,
          itemModel: source.itemModel,
          itemName: item.name,
          quantity: 0,
          minimumThreshold: getDefaultThreshold(source.itemType),
          reorderQuantity: 25,
          lastRestocked: null,
        });

        await inventory.save();
        createdItems.push(inventory);
      }
    }

    res.json({
      message: 'Inventory synced successfully',
      createdCount: createdItems.length,
      createdItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing inventory catalog', error: error.message });
  }
};
