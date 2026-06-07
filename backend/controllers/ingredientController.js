import PizzaBase from '../models/PizzaBase.js';
import Sauce from '../models/Sauce.js';
import Cheese from '../models/Cheese.js';
import Vegetable from '../models/Vegetable.js';

// Get all pizza bases
export const getPizzaBases = async (req, res) => {
  try {
    const bases = await PizzaBase.find();
    res.json(bases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pizza bases', error: error.message });
  }
};

// Add pizza base (admin)
export const addPizzaBase = async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    const base = new PizzaBase({ name, description, image, price });
    await base.save();
    res.status(201).json({ message: 'Pizza base added', base });
  } catch (error) {
    res.status(500).json({ message: 'Error adding pizza base', error: error.message });
  }
};

// Get all sauces
export const getSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find();
    res.json(sauces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sauces', error: error.message });
  }
};

// Add sauce (admin)
export const addSauce = async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    const sauce = new Sauce({ name, description, image, price });
    await sauce.save();
    res.status(201).json({ message: 'Sauce added', sauce });
  } catch (error) {
    res.status(500).json({ message: 'Error adding sauce', error: error.message });
  }
};

// Get all cheeses
export const getCheeses = async (req, res) => {
  try {
    const cheeses = await Cheese.find();
    res.json(cheeses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cheeses', error: error.message });
  }
};

// Add cheese (admin)
export const addCheese = async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    const cheese = new Cheese({ name, description, image, price });
    await cheese.save();
    res.status(201).json({ message: 'Cheese added', cheese });
  } catch (error) {
    res.status(500).json({ message: 'Error adding cheese', error: error.message });
  }
};

// Get all vegetables
export const getVegetables = async (req, res) => {
  try {
    const vegetables = await Vegetable.find();
    res.json(vegetables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vegetables', error: error.message });
  }
};

// Add vegetable (admin)
export const addVegetable = async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    const vegetable = new Vegetable({ name, description, image, price });
    await vegetable.save();
    res.status(201).json({ message: 'Vegetable added', vegetable });
  } catch (error) {
    res.status(500).json({ message: 'Error adding vegetable', error: error.message });
  }
};
