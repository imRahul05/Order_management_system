import React from 'react';

const ProductCard = ({ product, onAddToCart, isLoading = false, showAddToCart = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.images? (
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-1 overflow-hidden">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ₹{product.price}
          </span>
          
       
        </div>
        
        {showAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading || product.stock === 0}
            className={`w-full mt-4 py-2 px-4 rounded-md font-medium ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isLoading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            {isLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
        
        {!showAddToCart && (
          <div className="mt-4 py-2 px-4 bg-gray-100 text-gray-600 text-center rounded-md">
            Login to add to cart
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
