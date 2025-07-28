import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customers can add items to cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    
    try {
      await api.post('/orders/cart/add-to-cart', {
        items: [{
          productId: product._id,
          quantity: 1
        }]
      });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-600">Browse our available products</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products available</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={addToCart}
              isLoading={addingToCart[product._id]}
              showAddToCart={isAuthenticated && user?.role === 'customer'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
