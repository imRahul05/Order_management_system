import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '@/components/Loader';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/customer/orders');
      // Handle both cases: data could be directly an array or wrapped in orders property
      const ordersData = Array.isArray(response.data) ? response.data : (response.data.orders || []);
      setOrders(ordersData);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArr=[
        { key: 'all', label: 'All Orders' },
        { key: 'placed', label: 'Placed' },
        { key: 'processing', label: 'Processing' },
        { key: 'shipped', label: 'Shipped' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'cancelled', label: 'Cancelled' }
      ]
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'placed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  const getOrderTotal = (order) => {
    if (!order.items || order.items.length === 0) return '0.00';
    
    const total = order.items.reduce((sum, item) => {
      const price = parseFloat(item.productId?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return sum + (price * quantity);
    }, 0);
    
    return total.toFixed(2);
  };

  const getOrderItems = (order) => {
    return order.items || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      
      <Loader/>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">Track and manage your order history</p>
      </div>

     

    <div className="mb-6">
  {/* DropDown */}
  <div className="sm:hidden">
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
    >
      {filterArr.map(({ key, label }) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  </div>



{/* //HR */}
  <div className="hidden sm:block border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      {filterArr.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            filter === key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  </div>
</div>

 
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {filter === 'all' ? 'No orders found' : `No ${filter} orders found`}
          </h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all' 
              ? "You haven't placed any orders yet."
              : `You don't have any ${filter} orders at the moment.`
            }
          </p>
          {filter === 'all' && (
            <Link
              to="/customer/products"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold">#{order._id.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold text-lg">${getOrderTotal(order)}</p>
                    </div>
                    
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                      {order.locked && <span className="ml-1">🔒</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {getOrderItems(order).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {item.productId?.name || 'Product'}
                        </h5>
                        {item.productId?.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {item.productId.description}
                          </p>
                        )}
                        {item.productId?.category && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                            {item.productId.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">
                          ${item.productId?.price} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Subtotal: ${(parseFloat(item.productId?.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {getOrderItems(order).length} item{getOrderItems(order).length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex space-x-2">
                    {order.status?.toLowerCase() === 'pending' && (
                      <span className="text-sm text-yellow-600">
                        Order is being processed
                      </span>
                    )}
                    {order.status?.toLowerCase() === 'processing' && (
                      <span className="text-sm text-blue-600">
                        Order is being prepared
                      </span>
                    )}
                    {order.status?.toLowerCase() === 'shipped' && (
                      <span className="text-sm text-purple-600">
                        Order has been shipped
                      </span>
                    )}
                    {order.status?.toLowerCase() === 'delivered' && (
                      <span className="text-sm text-green-600">
                        Order has been delivered
                      </span>
                    )}
                    {order.status?.toLowerCase() === 'cancelled' && (
                      <span className="text-sm text-red-600">
                        Order was cancelled
                      </span>
                    )}
                    {order.status?.toLowerCase() === 'placed' && (
                      <span className="text-sm text-green-600">
                        Order has been placed successfully
                      </span>
                    )}
                    {order.paymentCollected && (
                      <span className="text-sm text-green-600 font-medium">
                        💳 Payment Collected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm opacity-90">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${orders.reduce((sum, order) => sum + parseFloat(getOrderTotal(order)), 0).toFixed(2)}
              </div>
              <div className="text-sm opacity-90">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status?.toLowerCase() === 'delivered').length}
              </div>
              <div className="text-sm opacity-90">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {orders.filter(order => ['pending', 'processing', 'shipped', 'placed'].includes(order.status?.toLowerCase())).length}
              </div>
              <div className="text-sm opacity-90">In Progress</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
