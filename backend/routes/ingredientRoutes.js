import express from 'express';
import {
  getPizzaBases,
  addPizzaBase,
  getSauces,
  addSauce,
  getCheeses,
  addCheese,
  getVegetables,
  addVegetable,
} from '../controllers/ingredientController.js';
import { verifyAdminAuth } from '../middleware/auth.js';

const router = express.Router();

// Pizza Bases
router.get('/bases', getPizzaBases);
router.post('/bases', verifyAdminAuth, addPizzaBase);

// Sauces
router.get('/sauces', getSauces);
router.post('/sauces', verifyAdminAuth, addSauce);

// Cheeses
router.get('/cheeses', getCheeses);
router.post('/cheeses', verifyAdminAuth, addCheese);

// Vegetables
router.get('/vegetables', getVegetables);
router.post('/vegetables', verifyAdminAuth, addVegetable);

export default router;
