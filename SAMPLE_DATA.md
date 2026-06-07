// Sample data script to seed the database
// Run this in MongoDB or use this as reference to add data

// Pizza Bases
db.pizzabases.insertMany([
  { name: "Thin Crust", description: "Crispy thin crust", price: 50, createdAt: new Date() },
  { name: "Regular Crust", description: "Classic regular crust", price: 70, createdAt: new Date() },
  { name: "Thick Crust", description: "Thick and chewy crust", price: 90, createdAt: new Date() },
  { name: "Stuffed Crust", description: "Crust filled with cheese", price: 110, createdAt: new Date() },
  { name: "Pan Pizza", description: "Baked in a pan", price: 100, createdAt: new Date() }
]);

// Sauces
db.sauces.insertMany([
  { name: "Tomato Sauce", description: "Classic tomato sauce", price: 0, createdAt: new Date() },
  { name: "Pesto Sauce", description: "Green pesto sauce", price: 20, createdAt: new Date() },
  { name: "Garlic Sauce", description: "Creamy garlic sauce", price: 15, createdAt: new Date() },
  { name: "BBQ Sauce", description: "Smoky BBQ sauce", price: 15, createdAt: new Date() },
  { name: "White Sauce", description: "Creamy white sauce", price: 20, createdAt: new Date() }
]);

// Cheeses
db.cheeses.insertMany([
  { name: "Mozzarella", description: "Fresh mozzarella", price: 40, createdAt: new Date() },
  { name: "Cheddar", description: "Sharp cheddar cheese", price: 50, createdAt: new Date() },
  { name: "Feta", description: "Crumbly feta cheese", price: 45, createdAt: new Date() },
  { name: "Blue Cheese", description: "Creamy blue cheese", price: 60, createdAt: new Date() },
  { name: "Parmesan", description: "Aged parmesan", price: 55, createdAt: new Date() }
]);

// Vegetables
db.vegetables.insertMany([
  { name: "Bell Peppers", description: "Red, yellow, green peppers", price: 10, createdAt: new Date() },
  { name: "Onions", description: "Fresh red onions", price: 8, createdAt: new Date() },
  { name: "Mushrooms", description: "Fresh mushrooms", price: 12, createdAt: new Date() },
  { name: "Tomatoes", description: "Fresh tomatoes", price: 10, createdAt: new Date() },
  { name: "Olives", description: "Black olives", price: 15, createdAt: new Date() },
  { name: "Spinach", description: "Fresh spinach", price: 10, createdAt: new Date() },
  { name: "Corn", description: "Sweet corn", price: 10, createdAt: new Date() },
  { name: "Broccoli", description: "Fresh broccoli", price: 12, createdAt: new Date() },
  { name: "Garlic", description: "Fresh garlic", price: 5, createdAt: new Date() },
  { name: "Jalapenos", description: "Spicy jalapenos", price: 8, createdAt: new Date() }
]);

// Admin (Create manually with proper password hash)
// Use bcrypt to hash password: bcrypt.hash("admin123", 10)
db.admins.insertOne({
  name: "Admin User",
  email: "admin@pizzadelivery.com",
  password: "$2a$10$...", // bcrypted password
  phone: "1234567890",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Sample Inventory
// First get the IDs from pizzabases, sauces, etc.
db.inventories.insertMany([
  {
    itemType: "base",
    itemId: ObjectId("..."), // pizza base id
    itemModel: "PizzaBase",
    itemName: "Thin Crust",
    quantity: 100,
    minimumThreshold: 20,
    reorderQuantity: 100,
    lastRestocked: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add similar entries for other items
]);
