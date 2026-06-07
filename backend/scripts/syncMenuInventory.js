import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import PizzaBase from '../models/PizzaBase.js';
import Sauce from '../models/Sauce.js';
import Cheese from '../models/Cheese.js';
import Vegetable from '../models/Vegetable.js';
import Inventory from '../models/Inventory.js';

dotenv.config();

const MENU_CATALOG = {
  bases: [
    {
      name: 'Hand Tossed',
      description: 'Soft, airy crust with a classic bite.',
      image: '',
      price: 0,
      stock: 40,
      minimumThreshold: 12,
      reorderQuantity: 20,
    },
    {
      name: 'Thin Crust',
      description: 'Crispy edge-to-edge crust.',
      image: '',
      price: 50,
      stock: 28,
      minimumThreshold: 10,
      reorderQuantity: 18,
    },
    {
      name: 'Cheese Burst',
      description: 'Molten cheese loaded crust.',
      image: '',
      price: 120,
      stock: 24,
      minimumThreshold: 8,
      reorderQuantity: 16,
    },
    {
      name: 'Wheat Thin Crust',
      description: 'Whole-wheat crisp crust option.',
      image: '',
      price: 80,
      stock: 22,
      minimumThreshold: 8,
      reorderQuantity: 14,
    },
    {
      name: 'Fresh Pan Pizza',
      description: 'Golden buttery pan-style crust.',
      image: '',
      price: 100,
      stock: 26,
      minimumThreshold: 8,
      reorderQuantity: 16,
    },
  ],
  sauces: [
    {
      name: 'Classic Tomato',
      description: 'Tangy classic tomato pizza sauce.',
      image: '',
      price: 0,
      stock: 55,
      minimumThreshold: 18,
      reorderQuantity: 24,
    },
    {
      name: 'Spicy Red Sauce',
      description: 'Hot and spicy red sauce.',
      image: '',
      price: 0,
      stock: 32,
      minimumThreshold: 12,
      reorderQuantity: 18,
    },
    {
      name: 'BBQ Sauce',
      description: 'Smoky barbecue style sauce.',
      image: '',
      price: 0,
      stock: 28,
      minimumThreshold: 10,
      reorderQuantity: 16,
    },
    {
      name: 'Garlic Parmesan',
      description: 'Creamy garlic parmesan sauce.',
      image: '',
      price: 0,
      stock: 25,
      minimumThreshold: 10,
      reorderQuantity: 14,
    },
    {
      name: 'Peri Peri Sauce',
      description: 'Zesty and spicy peri peri sauce.',
      image: '',
      price: 0,
      stock: 26,
      minimumThreshold: 10,
      reorderQuantity: 14,
    },
  ],
  cheeses: [
    {
      name: 'Mozzarella',
      description: 'Classic mozzarella cheese.',
      image: '',
      price: 0,
      stock: 60,
      minimumThreshold: 18,
      reorderQuantity: 24,
    },
    {
      name: 'Extra Mozzarella',
      description: 'Extra cheesy mozzarella layer.',
      image: '',
      price: 70,
      stock: 35,
      minimumThreshold: 12,
      reorderQuantity: 18,
    },
    {
      name: 'Cheddar Blend',
      description: 'Sharp cheddar cheese blend.',
      image: '',
      price: 90,
      stock: 26,
      minimumThreshold: 10,
      reorderQuantity: 14,
    },
    {
      name: 'Parmesan Mix',
      description: 'Savory parmesan cheese mix.',
      image: '',
      price: 120,
      stock: 22,
      minimumThreshold: 8,
      reorderQuantity: 12,
    },
    {
      name: 'Triple Cheese',
      description: 'Three-cheese indulgent mix.',
      image: '',
      price: 150,
      stock: 20,
      minimumThreshold: 8,
      reorderQuantity: 12,
    },
  ],
  vegetables: [
    {
      name: 'Onion',
      description: 'Fresh sliced onion.',
      image: '',
      price: 20,
      stock: 70,
      minimumThreshold: 20,
      reorderQuantity: 30,
    },
    {
      name: 'Capsicum',
      description: 'Crunchy green capsicum.',
      image: '',
      price: 20,
      stock: 68,
      minimumThreshold: 20,
      reorderQuantity: 28,
    },
    {
      name: 'Tomato',
      description: 'Juicy diced tomato.',
      image: '',
      price: 20,
      stock: 65,
      minimumThreshold: 18,
      reorderQuantity: 28,
    },
    {
      name: 'Sweet Corn',
      description: 'Sweet corn kernels.',
      image: '',
      price: 30,
      stock: 48,
      minimumThreshold: 16,
      reorderQuantity: 20,
    },
    {
      name: 'Jalapeno',
      description: 'Spicy jalapeno slices.',
      image: '',
      price: 40,
      stock: 34,
      minimumThreshold: 12,
      reorderQuantity: 16,
    },
    {
      name: 'Black Olive',
      description: 'Black olive slices.',
      image: '',
      price: 40,
      stock: 30,
      minimumThreshold: 10,
      reorderQuantity: 14,
    },
    {
      name: 'Mushroom',
      description: 'Fresh mushroom pieces.',
      image: '',
      price: 50,
      stock: 30,
      minimumThreshold: 10,
      reorderQuantity: 14,
    },
    {
      name: 'Paneer',
      description: 'Soft paneer cubes.',
      image: '',
      price: 70,
      stock: 26,
      minimumThreshold: 8,
      reorderQuantity: 12,
    },
    {
      name: 'Pineapple',
      description: 'Sweet pineapple chunks.',
      image: '',
      price: 40,
      stock: 18,
      minimumThreshold: 6,
      reorderQuantity: 10,
    },
    {
      name: 'Broccoli',
      description: 'Roasted broccoli florets.',
      image: '',
      price: 60,
      stock: 18,
      minimumThreshold: 6,
      reorderQuantity: 10,
    },
  ],
  meats: [
    {
      name: 'Chicken Tikka',
      stock: 24,
      minimumThreshold: 8,
      reorderQuantity: 12,
    },
    {
      name: 'Chicken Sausage',
      stock: 26,
      minimumThreshold: 8,
      reorderQuantity: 12,
    },
    {
      name: 'Grilled Chicken',
      stock: 22,
      minimumThreshold: 8,
      reorderQuantity: 10,
    },
    {
      name: 'Pepperoni',
      stock: 20,
      minimumThreshold: 6,
      reorderQuantity: 10,
    },
  ],
};

const nameKey = (value) => value.trim().toLowerCase();

const upsertIngredientWithInventory = async ({ model, itemType, itemModel, item }) => {
  const ingredient = await model.findOneAndUpdate(
    { name: item.name },
    {
      $set: {
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  await Inventory.findOneAndUpdate(
    { itemId: ingredient._id },
    {
      $set: {
        itemType,
        itemId: ingredient._id,
        itemModel,
        itemName: ingredient.name,
        nameKey: nameKey(ingredient.name),
        quantity: item.stock,
        minimumThreshold: item.minimumThreshold,
        reorderQuantity: item.reorderQuantity,
        lastRestocked: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

const upsertManualMeatInventory = async (item) => {
  await Inventory.findOneAndUpdate(
    { itemType: 'meat', nameKey: nameKey(item.name) },
    {
      $set: {
        itemType: 'meat',
        itemModel: 'Manual',
        itemName: item.name,
        nameKey: nameKey(item.name),
        quantity: item.stock,
        minimumThreshold: item.minimumThreshold,
        reorderQuantity: item.reorderQuantity,
        lastRestocked: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

const run = async () => {
  await connectDB();

  for (const item of MENU_CATALOG.bases) {
    await upsertIngredientWithInventory({
      model: PizzaBase,
      itemType: 'base',
      itemModel: 'PizzaBase',
      item,
    });
  }

  for (const item of MENU_CATALOG.sauces) {
    await upsertIngredientWithInventory({
      model: Sauce,
      itemType: 'sauce',
      itemModel: 'Sauce',
      item,
    });
  }

  for (const item of MENU_CATALOG.cheeses) {
    await upsertIngredientWithInventory({
      model: Cheese,
      itemType: 'cheese',
      itemModel: 'Cheese',
      item,
    });
  }

  for (const item of MENU_CATALOG.vegetables) {
    await upsertIngredientWithInventory({
      model: Vegetable,
      itemType: 'vegetable',
      itemModel: 'Vegetable',
      item,
    });
  }

  for (const item of MENU_CATALOG.meats) {
    await upsertManualMeatInventory(item);
  }

  const counts = {
    bases: await PizzaBase.countDocuments(),
    sauces: await Sauce.countDocuments(),
    cheeses: await Cheese.countDocuments(),
    vegetables: await Vegetable.countDocuments(),
    inventory: await Inventory.countDocuments(),
  };

  console.log('Menu and inventory synced successfully.');
  console.log(counts);
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to sync menu inventory:', error);
    process.exit(1);
  });
