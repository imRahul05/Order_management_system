import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/orders/cart');
      console.log(response.data.cart?.items);
      setCartItems(response.data.cart?.items || []);
    } catch (error) {
      toast.error('Failed to fetch cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await api.put(`/orders/cart/${itemId}`, { quantity: newQuantity });
      setCartItems(items =>
        items.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (item) => {
    try {
      console.log(item.productId._id)
      await api.delete(`/orders/cart/remove/${item.productId._id}`);
      setCartItems(items => items.filter(cartItem => cartItem._id !== item._id));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const checkout = async () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        }))
      };

      const response = await api.post('/orders/create', orderData);
      toast.success('Order placed successfully!');
      navigate('/customer/order-success', { 
        state: { order: response.data.order || response.data } 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Your cart is empty</div>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center p-6 border-b last:border-b-0">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                  <p className="text-gray-600">${item.productId.price} each</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold w-20 text-right">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center text-xl font-bold mb-4">
              <span>Total: ${calculateTotal()}</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={checkout}
                disabled={checkoutLoading}
                className={`flex-1 py-3 px-6 rounded-md text-white ${
                  checkoutLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {checkoutLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
