import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { sendEmail } from '../config/email.js';
import crypto from 'crypto';

const buildNameKey = (value = '') => value.trim().toLowerCase();

const collectInventorySelectors = (item) => {
  const selectors = [];

  [item.baseId, item.sauceId, item.cheeseId, ...(item.vegetables || [])]
    .filter(Boolean)
    .forEach((id) => {
      selectors.push({ itemId: id });
    });

  const customizations = item.customizations || {};

  if (customizations.base?.name) {
    selectors.push({ itemType: 'base', nameKey: buildNameKey(customizations.base.name) });
  }
  if (customizations.sauce?.name) {
    selectors.push({ itemType: 'sauce', nameKey: buildNameKey(customizations.sauce.name) });
  }
  if (customizations.cheese?.name) {
    selectors.push({ itemType: 'cheese', nameKey: buildNameKey(customizations.cheese.name) });
  }

  (customizations.veggies || []).forEach((veggie) => {
    if (veggie?.name) {
      selectors.push({ itemType: 'vegetable', nameKey: buildNameKey(veggie.name) });
    }
  });

  (customizations.nonVeg || []).forEach((meat) => {
    if (meat?.name) {
      selectors.push({ itemType: 'meat', nameKey: buildNameKey(meat.name) });
    }
  });

  return selectors;
};

const updateInventoryForOrder = async (order) => {
  for (const item of order.items) {
    const quantity = item.quantity || 1;
    const selectors = collectInventorySelectors(item);

    if (selectors.length === 0) {
      continue;
    }

    for (const selector of selectors) {
      await Inventory.findOneAndUpdate(selector, { $inc: { quantity: -quantity } });
    }
  }
};

const sendOrderConfirmationEmail = async (order) => {
  const user = await User.findById(order.userId);
  if (!user?.email) {
    return;
  }

  await sendEmail(
    user.email,
    'Order Confirmed - Pizza Delivery',
    `<h2>Your Order is Confirmed!</h2>
     <p>Order Number: ${order.orderNumber}</p>
     <p>Total Amount: Rs. ${order.totalPrice}</p>
     <p>Your pizza will be delivered soon!</p>`
  );
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, deliveryAddress, paymentMethod } = req.body;

    const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const order = new Order({
      orderNumber,
      userId: req.user.id,
      items,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      status: paymentMethod === 'cash' ? 'order_received' : 'pending',
    });

    await order.save();

    if (paymentMethod === 'cash') {
      await updateInventoryForOrder(order);
      await checkInventoryAndNotify();
      await sendOrderConfirmationEmail(order);
    }

    res.status(201).json({
      message:
        paymentMethod === 'cash' ? 'Order placed successfully' : 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Initiate Razorpay payment
export const initiateRazorpayPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Note: In production, use Razorpay SDK to create order
    // For now, we'll create a mock order ID
    const mockRazorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    order.razorpayOrderId = mockRazorpayOrderId;
    await order.save();

    res.json({
      message: 'Razorpay order initiated',
      razorpayOrderId: mockRazorpayOrderId,
      amount: order.totalPrice * 100, // Convert to paise
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error: error.message });
  }
};

// Confirm payment (Razorpay callback)
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.razorpayPaymentId = razorpayPaymentId;
    order.paymentStatus = 'completed';
    order.status = 'order_received';
    await order.save();

    await updateInventoryForOrder(order);

    // Check for low stock and send notification
    await checkInventoryAndNotify();

    await sendOrderConfirmationEmail(order);

    res.json({
      message: 'Payment confirmed and order placed',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.baseId')
      .populate('items.sauceId')
      .populate('items.cheeseId')
      .populate('items.vegetables')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('items.baseId')
      .populate('items.sauceId')
      .populate('items.cheeseId')
      .populate('items.vegetables')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send status update email to user
    await sendEmail(
      order.userId.email,
      `Order Status Updated - Pizza Delivery`,
      `<h2>Your Order Status</h2>
       <p>Order Number: ${order.orderNumber}</p>
       <p>Current Status: ${status.replace(/_/g, ' ').toUpperCase()}</p>`
    );

    res.json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Check inventory and notify admin of low stock
export const checkInventoryAndNotify = async () => {
  try {
    const admins = await Admin.find({ isActive: true });
    if (admins.length === 0) {
      return;
    }

    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$minimumThreshold'] },
    });

    for (const item of lowStockItems) {
      const notification = new Notification({
        adminId: admins[0]._id,
        type: 'low_stock',
        message: `Low stock alert: ${item.itemName}`,
        itemType: item.itemType,
        itemName: item.itemName,
        currentStock: item.quantity,
        threshold: item.minimumThreshold,
        emailSent: false,
      });

      await notification.save();

      // Send email to admin
      if (!notification.emailSent) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          'Low Stock Alert - Pizza Delivery',
          `<h2>Low Stock Alert</h2>
           <p>Item: ${item.itemName} (${item.itemType})</p>
           <p>Current Stock: ${item.quantity}</p>
           <p>Threshold: ${item.minimumThreshold}</p>
           <p>Please restock this item.</p>`
        );

        notification.emailSent = true;
        await notification.save();
      }
    }
  } catch (error) {
    console.error('Error checking inventory:', error);
  }
};

export default { createOrder, initiateRazorpayPayment, confirmPayment, getUserOrders, getAllOrders, updateOrderStatus };
