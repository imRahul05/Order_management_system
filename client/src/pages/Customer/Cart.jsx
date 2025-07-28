import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '@/components/Loader';

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
       <Loader/>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-gray-500 text-base sm:text-lg mb-4">Your cart is empty</div>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 text-sm sm:text-base font-medium"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow">
            {cartItems.map((item) => (
              <div key={item._id} className="p-4 sm:p-6 border-b last:border-b-0">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-semibold leading-tight">{item.productId.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">₹{item.productId.price} each</p>
                    </div>
                    <button
                      onClick={() => removeItem(item)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-lg font-semibold">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-gray-600">₹{item.productId.price} each</p>
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
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeItem(item)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

         
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <div className="text-lg sm:text-xl font-bold text-center sm:text-left">
                Total: ₹{calculateTotal()}
              </div>
              <div className="text-sm text-gray-600 text-center sm:text-right">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-4 sm:px-6 rounded-md hover:bg-gray-300 text-sm sm:text-base font-medium"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={checkout}
                disabled={checkoutLoading}
                className={`w-full sm:flex-1 py-3 px-4 sm:px-6 rounded-md text-white text-sm sm:text-base font-medium ${
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
