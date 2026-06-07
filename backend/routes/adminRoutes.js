import express from 'express';
import { adminLogin, getAdminProfile } from '../controllers/adminController.js';
import { verifyAdminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/profile', verifyAdminAuth, getAdminProfile);

export default router;
