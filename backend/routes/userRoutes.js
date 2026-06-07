import express from 'express';
import {
  registerUser,
  verifyEmail,
  devVerifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { verifyUserAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/dev-verify-email', devVerifyEmail); // Development only
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', verifyUserAuth, getUserProfile);
router.put('/profile', verifyUserAuth, updateUserProfile);

export default router;
