import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data.cartItems || []);
    } catch (err) {
      console.error('Error fetching cart:', err.response?.data || err.message);
      alert('Failed to load cart.');
    }
  };

  const handleRemoveFromCart = async (productId, removeQty) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        '/api/cart/remove',
        {
          productId,
          quantity: removeQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Removed ${removeQty} item(s) from cart`);
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      console.error('Remove from cart error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to remove from cart');
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {cart.map((item) => (
              <div key={item.productId} style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
                <h4>{item.Product?.name}</h4>
                <p>Price: ${item.product?.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ${(item.product?.price * item.quantity).toFixed(2)}</p>

                <input
                  type="number"
                  min={1}
                  max={item.quantity}
                  defaultValue={1}
                  id={`removeQty-${item.productId}`}
                  style={{ width: '100%', marginBottom: 10 }}
                />

                <button
                  onClick={() => {
                    const val = parseInt(document.getElementById(`removeQty-${item.productId}`).value);
                    if (val > 0 && val <= item.quantity) {
                      handleRemoveFromCart(item.productId, val);
                    } else {
                      alert('Invalid quantity to remove');
                    }
                  }}
                >
                  Remove from Cart
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, fontWeight: 'bold', fontSize: 18 }}>
            Total: ${getTotal()}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;