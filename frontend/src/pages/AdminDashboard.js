import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient';
import './AdminDashboard.css';

const initialInventoryForm = {
  itemType: 'meat',
  itemName: '',
  quantity: 0,
  minimumThreshold: 20,
  reorderQuantity: 25,
};

const typeLabels = {
  base: 'Pizza Base',
  sauce: 'Sauce',
  cheese: 'Cheese',
  vegetable: 'Veggies',
  meat: 'Meat',
};

const inventoryTypeOrder = ['base', 'sauce', 'cheese', 'vegetable', 'meat'];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [inventoryStats, setInventoryStats] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [inventoryForm, setInventoryForm] = useState(initialInventoryForm);
  const [inventoryDrafts, setInventoryDrafts] = useState({});
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState({
    sync: false,
    add: false,
  });

  useEffect(() => {
    refreshDashboardData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshDashboardData(false);
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const refreshDashboardData = async (showMessage = false) => {
    try {
      const [ordersRes, inventoryRes, lowStockRes, statsRes] = await Promise.all([
        apiClient.get('/orders/all'),
        apiClient.get('/inventory'),
        apiClient.get('/inventory/low-stock'),
        apiClient.get('/inventory/stats'),
      ]);

      setOrders(ordersRes.data);
      setInventory(inventoryRes.data);
      setLowStockItems(lowStockRes.data);
      setInventoryStats(statsRes.data);

      setInventoryDrafts((prev) => {
        const next = { ...prev };
        inventoryRes.data.forEach((item) => {
          next[item._id] = item.quantity;
        });
        return next;
      });

      if (showMessage) {
        setToast('Dashboard refreshed.');
      }
    } catch (error) {
      console.error('Error refreshing admin dashboard:', error);
    }
  };

  const groupedInventory = useMemo(() => {
    const groups = inventoryTypeOrder.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {});

    inventory.forEach((item) => {
      if (!groups[item.itemType]) {
        groups[item.itemType] = [];
      }
      groups[item.itemType].push(item);
    });

    return groups;
  }, [inventory]);

  const statsByType = useMemo(() => {
    return inventoryStats.reduce((acc, stat) => {
      acc[stat._id] = stat;
      return acc;
    }, {});
  }, [inventoryStats]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiClient.put('/orders/status', {
        orderId,
        status: newStatus,
      });
      await refreshDashboardData();
      setToast('Order status updated successfully.');
    } catch (error) {
      setToast('Error updating order status.');
    }
  };

  const handleInventoryUpdate = async (itemId, quantity) => {
    try {
      await apiClient.put('/inventory/update', {
        itemId,
        quantity: Number(quantity),
      });
      await refreshDashboardData();
      setToast('Inventory updated successfully.');
    } catch (error) {
      setToast('Error updating inventory.');
    }
  };

  const handleSyncInventory = async () => {
    try {
      setLoading((prev) => ({ ...prev, sync: true }));
      const response = await apiClient.post('/inventory/sync');
      await refreshDashboardData();
      setToast(`Inventory synced. ${response.data.createdCount} items added.`);
    } catch (error) {
      setToast('Error syncing ingredient inventory.');
    } finally {
      setLoading((prev) => ({ ...prev, sync: false }));
    }
  };

  const handleAddInventoryItem = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, add: true }));
      await apiClient.post('/inventory/add', inventoryForm);
      setInventoryForm(initialInventoryForm);
      await refreshDashboardData();
      setToast('Inventory item added.');
    } catch (error) {
      setToast(error.response?.data?.message || 'Error adding inventory item.');
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      order_received: '#0ea5e9',
      in_kitchen: '#f97316',
      out_for_delivery: '#6366f1',
      delivered: '#16a34a',
      cancelled: '#dc2626',
    };
    return colors[status] || '#6b7280';
  };

  const renderInventoryGroup = (type) => {
    const items = groupedInventory[type] || [];
    const stats = statsByType[type];

    return (
      <section key={type} className="inventory-section">
        <div className="inventory-section-header">
          <div>
            <span className="mini-label">{typeLabels[type]}</span>
            <h3>{typeLabels[type]} Stock</h3>
          </div>
          <div className="inventory-section-stats">
            <div>
              <span>Total Units</span>
              <strong>{stats?.totalQuantity || 0}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{stats?.itemCount || 0}</strong>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">No {typeLabels[type].toLowerCase()} inventory added yet.</div>
        ) : (
          <div className="inventory-grid">
            {items.map((item) => {
              const isLowStock = item.quantity <= item.minimumThreshold;

              return (
                <div
                  key={item._id}
                  className={`inventory-card ${isLowStock ? 'low-stock' : ''}`}
                >
                  <div className="inventory-card-header">
                    <div>
                      <h4>{item.itemName}</h4>
                      <p className="item-type">{typeLabels[item.itemType] || item.itemType}</p>
                    </div>
                    <span className={`stock-pill ${isLowStock ? 'danger' : 'safe'}`}>
                      {isLowStock ? 'Low stock' : 'Healthy'}
                    </span>
                  </div>

                  <div className="inventory-info">
                    <p>
                      <strong>Available:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Threshold:</strong> {item.minimumThreshold}
                    </p>
                    <p>
                      <strong>Quick Restock:</strong> +{item.reorderQuantity}
                    </p>
                  </div>

                  <div className="inventory-actions">
                    <input
                      type="number"
                      min="0"
                      value={inventoryDrafts[item._id] ?? item.quantity}
                      onChange={(e) =>
                        setInventoryDrafts((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      className="quantity-input"
                    />
                    <button
                      type="button"
                      className="save-stock-btn"
                      onClick={() => handleInventoryUpdate(item._id, inventoryDrafts[item._id])}
                    >
                      Save Stock
                    </button>
                    <button
                      type="button"
                      className="restock-btn"
                      onClick={() => handleInventoryUpdate(item._id, item.quantity + item.reorderQuantity)}
                    >
                      Restock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-hero">
        <div>
          <span className="mini-label">Operations Center</span>
          <h1>Admin Inventory Dashboard</h1>
          <p>
            Track live stock for crusts, sauces, cheese, veggies, and meat. Stock levels update
            automatically after every order.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" className="action-btn secondary" onClick={() => refreshDashboardData(true)}>
            Refresh
          </button>
          <button
            type="button"
            className="action-btn primary"
            onClick={handleSyncInventory}
            disabled={loading.sync}
          >
            {loading.sync ? 'Syncing...' : 'Sync Ingredients To Inventory'}
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="metric-card">
          <span>Inventory Items</span>
          <strong>{inventory.length}</strong>
        </div>
        <div className="metric-card">
          <span>Low Stock Alerts</span>
          <strong>{lowStockItems.length}</strong>
        </div>
        <div className="metric-card">
          <span>Pending Orders</span>
          <strong>{orders.filter((order) => order.status === 'pending').length}</strong>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts ({lowStockItems.length})
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="tab-content">
          <div className="section-topline">
            <h2>Recent Orders</h2>
            <p>Stock is deducted once an order is confirmed and reflected in inventory.</p>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.userId?.name || 'Customer'}</td>
                    <td>Rs. {order.totalPrice}</td>
                    <td>{order.items.length}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="order_received">Order Received</option>
                        <option value="in_kitchen">In Kitchen</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="tab-content inventory-tab">
          <div className="inventory-toolbar">
            <div className="section-topline">
              <h2>Mini Inventory Management</h2>
              <p>Add manual meat items and manage stock across every pizza category.</p>
            </div>

            <form className="inventory-form" onSubmit={handleAddInventoryItem}>
              <select
                value={inventoryForm.itemType}
                onChange={(e) =>
                  setInventoryForm((prev) => ({ ...prev, itemType: e.target.value }))
                }
              >
                {inventoryTypeOrder.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Item name"
                value={inventoryForm.itemName}
                onChange={(e) =>
                  setInventoryForm((prev) => ({ ...prev, itemName: e.target.value }))
                }
                required
              />
              <input
                type="number"
                min="0"
                placeholder="Stock"
                value={inventoryForm.quantity}
                onChange={(e) =>
                  setInventoryForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                }
                required
              />
              <input
                type="number"
                min="0"
                placeholder="Threshold"
                value={inventoryForm.minimumThreshold}
                onChange={(e) =>
                  setInventoryForm((prev) => ({
                    ...prev,
                    minimumThreshold: Number(e.target.value),
                  }))
                }
                required
              />
              <input
                type="number"
                min="1"
                placeholder="Reorder qty"
                value={inventoryForm.reorderQuantity}
                onChange={(e) =>
                  setInventoryForm((prev) => ({
                    ...prev,
                    reorderQuantity: Number(e.target.value),
                  }))
                }
                required
              />
              <button type="submit" className="action-btn primary" disabled={loading.add}>
                {loading.add ? 'Adding...' : 'Add Item'}
              </button>
            </form>
          </div>

          {inventoryTypeOrder.map((type) => renderInventoryGroup(type))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="tab-content">
          <div className="section-topline">
            <h2>Low Stock Alerts</h2>
            <p>These items need restocking soon to avoid order disruption.</p>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="no-alerts">All items are well stocked.</p>
          ) : (
            <div className="alerts-list">
              {lowStockItems.map((item) => (
                <div key={item._id} className="alert-card">
                  <div className="alert-card-top">
                    <h4>{item.itemName}</h4>
                    <span className="stock-pill danger">Needs attention</span>
                  </div>
                  <p>
                    <strong>Type:</strong> {typeLabels[item.itemType] || item.itemType}
                  </p>
                  <p>
                    <strong>Current Stock:</strong> <span className="low-quantity">{item.quantity}</span>
                  </p>
                  <p>
                    <strong>Threshold:</strong> {item.minimumThreshold}
                  </p>
                  <button
                    onClick={() => handleInventoryUpdate(item._id, item.quantity + item.reorderQuantity)}
                    className="restock-btn"
                    type="button"
                  >
                    Restock (+{item.reorderQuantity})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
};

export default AdminDashboard;
