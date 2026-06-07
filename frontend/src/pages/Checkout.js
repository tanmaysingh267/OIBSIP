import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [pizza, setPizza] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const customPizza = localStorage.getItem('customPizza');
    if (customPizza) {
      setPizza(JSON.parse(customPizza));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create order
      const orderResponse = await apiClient.post('/orders/create', {
        items: [pizza],
        totalPrice: pizza.price,
        deliveryAddress,
        paymentMethod,
      });

      const orderId = orderResponse.data.order._id;

      if (paymentMethod === 'razorpay') {
        // Initiate Razorpay payment
        const paymentResponse = await apiClient.post('/orders/razorpay/initiate', {
          orderId,
          amount: pizza.price,
        });

        // Load Razorpay script and open checkout
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: paymentResponse.data.amount,
            currency: 'INR',
            order_id: paymentResponse.data.razorpayOrderId,
            handler: async (response) => {
              try {
                await apiClient.post('/orders/razorpay/confirm', {
                  orderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                alert('Payment successful! Your order has been placed.');
                localStorage.removeItem('customPizza');
                navigate('/dashboard');
              } catch (err) {
                setError('Payment confirmation failed');
              }
            },
            prefill: {
              name: user?.name,
              email: user?.email,
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        alert('Order placed successfully! Your cash on delivery order has been recorded.');
        localStorage.removeItem('customPizza');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (!pizza) {
    return <div>Loading...</div>;
  }

  const customizations = pizza.customizations || {};
  const summarySize = customizations.size?.name;
  const summaryBase = customizations.base?.name;
  const summarySauce = customizations.sauce?.name;
  const summaryCheese = customizations.cheese?.name;
  const summaryVeggies = customizations.veggies?.map((item) => item.name).join(', ');
  const summaryNonVeg = customizations.nonVeg?.map((item) => item.name).join(', ');

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-grid">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="pizza-info">
            {summarySize && (
              <p>
                <strong>Size:</strong> {summarySize}
              </p>
            )}
            {summaryBase && (
              <p>
                <strong>Base:</strong> {summaryBase}
              </p>
            )}
            {summarySauce && (
              <p>
                <strong>Sauce:</strong> {summarySauce}
              </p>
            )}
            {summaryCheese && (
              <p>
                <strong>Cheese:</strong> {summaryCheese}
              </p>
            )}
            {summaryVeggies && (
              <p>
                <strong>Veggies:</strong> {summaryVeggies}
              </p>
            )}
            {summaryNonVeg && (
              <p>
                <strong>Non-Veg:</strong> {summaryNonVeg}
              </p>
            )}
            <p>
              <strong>Quantity:</strong> {pizza.quantity || 1}
            </p>
            {pizza.subtotal && (
              <p>
                <strong>Subtotal:</strong> Rs. {pizza.subtotal.toFixed(2)}
              </p>
            )}
            {pizza.gst && (
              <p>
                <strong>GST:</strong> Rs. {pizza.gst.toFixed(2)}
              </p>
            )}
            <p>
              <strong>Total:</strong> Rs. {pizza.price}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentMethod.toUpperCase()}
            </p>
            {customizations.estimatedDeliveryTime && (
              <p>
                <strong>Est. Delivery:</strong> {customizations.estimatedDeliveryTime}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <h3>Delivery Address</h3>
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={deliveryAddress.street}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={deliveryAddress.city}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={deliveryAddress.state}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={deliveryAddress.zipCode}
            onChange={handleAddressChange}
            required
          />

          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Razorpay
            </label>
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          <button type="submit" disabled={loading} className="place-order-btn">
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
