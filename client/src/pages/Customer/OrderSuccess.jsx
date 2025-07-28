import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Debug: Log the order data to see what we're receiving
  console.log('Order data received:', order);

  useEffect(() => {
    // Clear cart after successful order
    const clearCart = async () => {
      try {
        await api.delete('/orders/cart/clear');
        console.log('Cart cleared successfully');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    };

    if (order) {
      clearCart();
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h2>
          <Link 
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (order.total) {
      return order.total;
    }
    
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((total, item) => {
        const price = item.productId?.price || item.price || item.productPrice || 0;
        const quantity = parseInt(item.quantity) || 1;
        return total + (price * quantity);
      }, 0).toFixed(2);
    }
    
    return '0.00';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">Thank you for your order. We'll process it shortly.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold">#{order._id || order.id || order.orderId || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt || order.orderDate || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold capitalize">{order.status || order.orderStatus || 'Pending'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-semibold text-xl text-green-600">${calculateTotal()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold">{order.customerId?.username || order.customer?.username || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <p className="font-semibold">
              <span className={`px-2 py-1 rounded-full text-xs ${
                order.paymentCollected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.paymentCollected ? 'Collected' : 'Pending'}
              </span>
            </p>
          </div>
        </div>

        {/* Debug Information */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        )} */}

        {(order.items || order.orderItems) && (order.items || order.orderItems).length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({order.items.length})</h3>
            <div className="space-y-3">
              {(order.items || order.orderItems).map((item, index) => {
                const product = item.productId || item.product || item;
                const productName = product?.name || item.productName || `Product ${index + 1}`;
                const price = product?.price || item.price || item.productPrice || 0;
                const quantity = parseInt(item.quantity) || 1;
                const description = product?.description || item.productDescription;
                const category = product?.category || item.category;
                
                return (
                  <div key={item._id || index} className="flex justify-between items-center py-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-lg">{productName}</p>
                        {category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {category}
                          </span>
                        )}
                      </div>
                      {description && (
                        <p className="text-sm text-gray-600 mb-2">{description}</p>
                      )}
                      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-lg">${(price * quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${price} each</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">${calculateTotal()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Order items information not available</p>
            <p className="text-sm">Your order has been processed successfully</p>
          </div>
        )}
      </div>

      <div className="text-center space-y-4">
        <div className="space-x-4">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
        
        <p className="text-sm text-gray-600">
          You will receive an email confirmation shortly with tracking information.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
