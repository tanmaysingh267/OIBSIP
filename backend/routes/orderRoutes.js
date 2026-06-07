import express from 'express';
import {
  createOrder,
  initiateRazorpayPayment,
  confirmPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyUserAuth, verifyAdminAuth } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/create', verifyUserAuth, createOrder);
router.post('/razorpay/initiate', verifyUserAuth, initiateRazorpayPayment);
router.post('/razorpay/confirm', verifyUserAuth, confirmPayment);
router.get('/my-orders', verifyUserAuth, getUserOrders);

// Admin routes
router.get('/all', verifyAdminAuth, getAllOrders);
router.put('/status', verifyAdminAuth, updateOrderStatus);

export default router;
