import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '@/components/Loader';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockingOrder, setLockingOrder] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/staff/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const lockOrder = async () => {
    setLockingOrder(true);
    
    try {
      await api.patch(`/orders/staff/${id}/lock`);
      toast.success('Order locked successfully');
      fetchOrderDetails(); 
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to lock order';
      toast.error(message);
    } finally {
      setLockingOrder(false);
    }
  };

  const unlockOrder = async () => {
    setLockingOrder(true);
    
    try {
      await api.patch(`/orders/staff/${id}/unlock`);
      toast.success('Order unlocked successfully');
      fetchOrderDetails(); 
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unlock order';
      toast.error(message);
    } finally {
      setLockingOrder(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setUpdatingStatus(true);
    
    try {
      await api.patch(`/orders/staff/updateStatus/${id}`, {
        status: newStatus
      });
      toast.success(`Order status updated to ${newStatus}`);
      setShowStatusDropdown(false);
      fetchOrderDetails(); 
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getAvailableStatuses = () => {
    const allStatuses = ['placed', 'shipped', 'delivered', 'cancelled', 'completed'];
 
    return allStatuses.filter(status => 
      status.toLowerCase() !== order?.orderStatus?.toLowerCase()
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
      case 'locked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOrderTotal = () => {
    return order?.staffTotal || order?.orderTotal || '0.00';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
       <Loader/>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>
        
        <div className="flex space-x-4">
          {/* Status Update Dropdown */}
          <div className="relative status-dropdown">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              disabled={updatingStatus || order.locked}
              className={`px-4 py-2 rounded-md text-white ${
                updatingStatus || order.locked
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {updatingStatus ? 'Updating...' : 'Update Status'}
            </button>
            
            {showStatusDropdown && !order.locked && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {getAvailableStatuses().map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(status)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!order.locked && (
            <button
              onClick={lockOrder}
              disabled={lockingOrder}
              className={`px-4 py-2 rounded-md text-white ${
                lockingOrder
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {lockingOrder ? 'Locking...' : 'Lock Order'}
            </button>
          )}
          
          {order.locked && (
            <button
              onClick={unlockOrder}
              disabled={lockingOrder}
              className={`px-4 py-2 rounded-md text-white ${
                lockingOrder
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {lockingOrder ? 'Unlocking...' : 'Unlock Order'}
            </button>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-semibold">#{order.orderId}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
                {order.locked && <span className="ml-1">🔒</span>}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">
                {new Date(order.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Customer Name</p>
              <p className="font-semibold">{order.customer?.username || 'N/A'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Customer Email</p>
              <p className="font-semibold">{order.customer?.email || 'N/A'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-green-600">${calculateOrderTotal()}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Staff Related Items</p>
              <p className="font-semibold">{order.staffRelatedItems} of {order.totalItems} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
        
        {order.staffItems && order.staffItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.staffItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </div>
                        {item.productDescription && (
                          <div className="text-sm text-gray-500">
                            {item.productDescription}
                          </div>
                        )}
                        {item.category && (
                          <div className="text-xs text-blue-600 bg-blue-100 inline-block px-2 py-1 rounded mt-1">
                            {item.category}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.productPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.subtotal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.inStock} available
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 text-right">
              <div className="text-xl font-bold text-gray-900">
                Staff Total: ${calculateOrderTotal()}
              </div>
              {order.orderTotal !== order.staffTotal && (
                <div className="text-sm text-gray-600">
                  Full Order Total: ${order.orderTotal}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No staff-related items found in this order
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
