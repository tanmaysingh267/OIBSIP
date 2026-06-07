# Pizza Delivery Application - Setup Guide

## Quick Start

### Step 1: Clone the Repository
```bash
cd pizza-delivery-app
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - MongoDB URI
# - JWT Secret
# - Email credentials (Gmail)
# - Razorpay credentials
# - Admin email

# Start MongoDB
mongod

# In a new terminal, start the backend server
npm run dev
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with frontend configuration
# - API URL
# - Razorpay Key ID

# Start the frontend
npm start
```

### Step 4: Seed Initial Data

The application comes with the following models ready to use. Add test data via API or MongoDB:

1. **Pizza Bases** (5 options)
2. **Sauces** (5 options)
3. **Cheeses** (multiple options)
4. **Vegetables** (multiple options)
5. **Admin Account**
6. **Inventory Items**

### Step 5: Testing

#### User Flow
1. Go to http://localhost:3000
2. Register → Verify Email → Login
3. Customize Pizza
4. Proceed to Checkout
5. Use Razorpay test card: 4111111111111111

#### Admin Flow
1. Go to http://localhost:3000/admin/login
2. Use admin credentials
3. View orders and update status
4. Manage inventory
5. Monitor low stock alerts

## Important Configuration

### Email Setup (Gmail)
1. Enable 2-Factor Authentication
2. Generate App Password
3. Add to backend `.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

### Razorpay Setup
1. Get test credentials from Razorpay Dashboard
2. Add to backend `.env`:
   ```
   RAZORPAY_KEY_ID=key_xxxxx
   RAZORPAY_KEY_SECRET=secret_xxxxx
   ```
3. Add to frontend `.env`:
   ```
   REACT_APP_RAZORPAY_KEY_ID=key_xxxxx
   ```

### MongoDB Setup
- Local: `mongodb://localhost:27017/pizza-delivery`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/pizza-delivery`

## Default Test Accounts

### Admin (Create manually in MongoDB)
```json
{
  "email": "admin@pizzadelivery.com",
  "password": "admin123"
}
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check MongoDB service status

### CORS Error
- Backend is configured for frontend at http://localhost:3000
- Modify if using different port

### Email Not Sending
- Check Gmail App Password is correct
- Verify "Less secure app access" is enabled
- Check email configuration

## Key URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## API Documentation

See main README.md for complete API endpoint documentation.

## Next Steps

1. Add sample pizza ingredients
2. Create test admin account
3. Set up inventory items
4. Configure email templates
5. Test complete user flow
6. Deploy to production
