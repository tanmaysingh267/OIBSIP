# Comprehensive README for Pizza Delivery Application

## Overview
A full-stack Pizza Delivery Application built with React, Node.js, Express, and MongoDB. Features include user authentication, pizza customization, order management, inventory tracking, and admin dashboard.

## Features Implemented

### User Features
- User Registration with Email Verification
- User Login/Logout
- Forgot Password & Password Reset
- Email Verification System
- User Profile Management
- Pizza Customization Flow (Base → Sauce → Cheese → Vegetables)
- Order Placement
- Razorpay Payment Integration (Test Mode)
- Order Tracking with Real-time Status Updates

### Admin Features
- Admin Login/Authentication
- Order Management Dashboard
- Order Status Updates (Pending → Order Received → In Kitchen → Out for Delivery → Delivered)
- Inventory Management System
- Low Stock Alerts & Notifications
- Email Notifications for Low Stock Items
- Inventory Statistics

### Security Features
- JWT-based Authentication
- Password Hashing with bcryptjs
- Email Verification
- Protected Routes
- Admin Authorization

## Project Structure

```
pizza-delivery-app/
├── backend/
│   ├── models/                 # MongoDB Models
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── PizzaBase.js
│   │   ├── Sauce.js
│   │   ├── Cheese.js
│   │   ├── Vegetable.js
│   │   ├── Order.js
│   │   ├── Inventory.js
│   │   └── Notification.js
│   ├── controllers/            # Business Logic
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   ├── ingredientController.js
│   │   ├── orderController.js
│   │   └── inventoryController.js
│   ├── routes/                 # API Routes
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── ingredientRoutes.js
│   │   ├── orderRoutes.js
│   │   └── inventoryRoutes.js
│   ├── middleware/             # Authentication Middleware
│   │   └── auth.js
│   ├── utils/                  # Utility Functions
│   │   ├── jwt.js
│   │   └── tokenUtils.js
│   ├── config/                 # Configuration Files
│   │   ├── database.js
│   │   └── email.js
│   ├── server.js              # Main Server File
│   ├── package.json
│   └── .env.example

├── frontend/
│   ├── src/
│   │   ├── pages/             # Page Components
│   │   │   ├── Register.js
│   │   │   ├── Login.js
│   │   │   ├── AdminLogin.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Checkout.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── Auth.css
│   │   ├── components/        # Reusable Components
│   │   │   ├── Navbar.js
│   │   │   ├── PizzaCustomizer.js
│   │   │   └── Navbar.css
│   │   ├── context/           # Context API
│   │   │   └── AuthContext.js
│   │   ├── utils/             # Utility Functions
│   │   │   └── apiClient.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Razorpay Account (for payment integration)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```
   MONGODB_URI=mongodb://localhost:27017/pizza-delivery
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_app_password
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ADMIN_EMAIL=admin@pizzadelivery.com
   ```

5. Start MongoDB:
   ```bash
   # Windows
   mongod
   
   # macOS
   brew services start mongodb-community
   ```

6. Run the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. Start the application:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`.

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - User Registration
- `POST /verify-email` - Email Verification
- `POST /login` - User Login
- `POST /forgot-password` - Initiate Password Reset
- `POST /reset-password` - Reset Password
- `GET /profile` - Get User Profile (Protected)
- `PUT /profile` - Update User Profile (Protected)

### Admin Routes (`/api/admin`)
- `POST /login` - Admin Login
- `GET /profile` - Get Admin Profile (Protected)

### Ingredient Routes (`/api/ingredients`)
- `GET /bases` - Get All Pizza Bases
- `POST /bases` - Add Pizza Base (Admin)
- `GET /sauces` - Get All Sauces
- `POST /sauces` - Add Sauce (Admin)
- `GET /cheeses` - Get All Cheeses
- `POST /cheeses` - Add Cheese (Admin)
- `GET /vegetables` - Get All Vegetables
- `POST /vegetables` - Add Vegetable (Admin)

### Order Routes (`/api/orders`)
- `POST /create` - Create Order (User)
- `POST /razorpay/initiate` - Initiate Razorpay Payment (User)
- `POST /razorpay/confirm` - Confirm Payment (User)
- `GET /my-orders` - Get User Orders (User)
- `GET /all` - Get All Orders (Admin)
- `PUT /status` - Update Order Status (Admin)

### Inventory Routes (`/api/inventory`)
- `GET /` - Get All Inventory Items (Admin)
- `POST /add` - Add Inventory Item (Admin)
- `PUT /update` - Update Inventory Quantity (Admin)
- `GET /low-stock` - Get Low Stock Items (Admin)
- `GET /stats` - Get Inventory Statistics (Admin)

## Testing the Application

### Creating Test Data

1. **Create Admin Account** (Access MongoDB directly):
   ```javascript
   db.admins.insertOne({
     name: "Admin User",
     email: "admin@pizzadelivery.com",
     password: "bcrypt_hash_here",
     phone: "1234567890",
     role: "admin",
     isActive: true
   })
   ```

2. **Add Pizza Ingredients** (Via API or Directly):
   - Add 5 Pizza Bases
   - Add 5 Sauces
   - Add 3 Cheese Types
   - Add Multiple Vegetables

3. **Set Up Inventory**:
   - Link ingredients to inventory with quantities and thresholds

### Testing User Flow

1. Register a new user
2. Verify email
3. Login
4. Customize a pizza
5. Add to cart
6. Checkout with Razorpay (use test card: 4111111111111111)
7. Track order status in dashboard

### Testing Admin Flow

1. Login as admin
2. View orders
3. Update order status
4. Monitor inventory
5. Check low stock alerts

## Razorpay Test Mode

### Test Card Details
- Card Number: 4111111111111111
- Expiry: Any future date (e.g., 12/25)
- CVV: 123
- OTP: 123456

## Email Configuration

For Gmail:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in `.env`

## Scheduled Tasks

- **Hourly Inventory Check**: Automatically checks for low stock and sends email notifications

## Key Features Implementation Details

### Email Verification
- Verification token valid for 24 hours
- Email sent to user after registration
- Link expires after verification

### Password Reset
- Reset token valid for 1 hour
- Secure token generation
- Email sent to user

### Order Status Updates
- Real-time email notifications on status changes
- Admin can update status at any time
- User can track current order status

### Low Stock Alerts
- Automatic detection when stock falls below threshold
- Email notification to admin
- Visual alert in admin dashboard
- Quick restock button

### Inventory Management
- Track all pizza ingredients
- Set minimum thresholds
- Auto-reorder quantities
- Real-time quantity updates

## Future Enhancements

1. **WebSocket Integration**: Real-time order updates without polling
2. **Google Maps API**: Delivery tracking with map
3. **Two-Factor Authentication**: Enhanced security
4. **Order Reviews & Ratings**: User feedback system
5. **Promotional Codes**: Discount management
6. **SMS Notifications**: Order updates via SMS
7. **Mobile App**: React Native mobile application
8. **Analytics Dashboard**: Sales and order analytics
9. **Delivery Partner App**: Real-time delivery tracking
10. **Payment Methods**: Multiple payment gateway integration

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB is accessible on specified port

### Email Not Sending
- Check Gmail App Password is correct
- Enable "Less secure app access"
- Check email configuration in `.env`

### Razorpay Integration Issues
- Verify Razorpay credentials are correct
- Check test mode is enabled
- Ensure script is loaded in HTML

### CORS Issues
- Verify `CORS` is properly configured in backend
- Check frontend URL is whitelisted
- Clear browser cache

## Support & Contact

For issues or questions, please create an issue in the repository or contact the development team.

## License

This project is licensed under the MIT License.
