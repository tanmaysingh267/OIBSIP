import React, { useEffect, useState } from 'react';
import PizzaCustomizer from '../components/PizzaCustomizer';
import apiClient from '../utils/apiClient';
import './Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      order_received: '#17a2b8',
      in_kitchen: '#fd7e14',
      out_for_delivery: '#0dcaf0',
      delivered: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="dashboard">
      <h1>Welcome to Pizza Delivery</h1>

      <div className="dashboard-actions">
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="customize-btn"
        >
          {showCustomizer ? 'Hide Customizer' : 'Customize Your Pizza'}
        </button>
      </div>

      {showCustomizer && <PizzaCustomizer />}

      <div className="orders-section">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No orders yet. Start by customizing a pizza!</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.orderNumber}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className="order-details">
                  <p>
                    <strong>Total:</strong> Rs. {order.totalPrice}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentStatus.toUpperCase()}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.items.length}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
