import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/products?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);

      // Initialize quantities to 1
      const initialQuantities = {};
      res.data.products.forEach(p => {
        initialQuantities[p.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error('Failed to fetch products:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();

    socket.on('productUpdated', (product) => {
      setProducts(prev =>
        prev.map(p => p.id === product.id ? product : p)
      );
    });

    socket.on('productDeleted', (id) => {
      setProducts(prev =>
        prev.filter(p => p.id !== id && p.id !== Number(id))
      );
    });

    socket.on('productCreated', (product) => {
      setProducts(prev => [...prev, product]);
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    });

    return () => {
      socket.off('productUpdated');
      socket.off('productDeleted');
      socket.off('productCreated');
    };
  }, [page]);

  const handleQuantityChange = (id, value) => {
    const parsed = parseInt(value, 10);
    setQuantities(prev => ({
      ...prev,
      [id]: isNaN(parsed) || parsed < 1 ? 1 : parsed
    }));
  };

  const handleAddToCart = async (product) => {
    const qty = quantities[product.id] || 1;
  
    if (qty > product.stock) {
      alert(`Only ${product.stock} items available in stock.`);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      await axios.post(
        '/api/cart/add',
        {
          productId: product.id,
          quantity: qty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      alert(`${product.name} (x${qty}) added to cart`);
    } catch (err) {
      console.error('Add to cart error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to add item to cart');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product List</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
            <h4>{product.name}</h4>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>

            <input
              type="number"
              min="1"
              value={quantities[product.id] || 1}
              onChange={e => handleQuantityChange(product.id, e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />

            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
