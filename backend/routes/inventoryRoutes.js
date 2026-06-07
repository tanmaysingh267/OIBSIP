import express from 'express';
import {
  getAllInventory,
  addInventoryItem,
  updateInventoryQuantity,
  getLowStockItems,
  getInventoryStats,
  syncInventoryCatalog,
} from '../controllers/inventoryController.js';
import { verifyAdminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyAdminAuth, getAllInventory);
router.post('/add', verifyAdminAuth, addInventoryItem);
router.put('/update', verifyAdminAuth, updateInventoryQuantity);
router.get('/low-stock', verifyAdminAuth, getLowStockItems);
router.get('/stats', verifyAdminAuth, getInventoryStats);
router.post('/sync', verifyAdminAuth, syncInventoryCatalog);

export default router;
