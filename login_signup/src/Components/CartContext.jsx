import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);

  // Load cart from backend on initial render if user logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get('http://localhost:5000/cart', { 
            headers: { 'X-User-Email': user.email } // send the user email to the backend    
          });
          const items = JSON.parse(response.data.items || '[]'); 
          setCart(items); // set the cart to the items  
        } catch (error) {
          console.error('Failed to fetch cart from backend:', error);
        }
      }
    };
    fetchCart();
  }, [user]);

  // Save cart to backend whenever cart changes and user logged in
  useEffect(() => {
    const saveCart = async () => {
      if (user && user.email) {
        try {
          await axios.post('http://localhost:5000/cart', {
            items: JSON.stringify(cart) // convert the cart to a string  
          }, {
            headers: { 'X-User-Email': user.email } // send the user email to the backend   
          });
        } catch (error) {
          console.error('Failed to save cart to backend:', error);
        }
      }
    };
    saveCart();
  }, [cart, user]); // save the cart to the backend whenever the cart changes and the user is logged in   

  // Add item to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id); // Check if the item already exists in the cart  

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }]; // Add the item to the cart  
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Calculate total items count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // calculate the total number of items in the cart   

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
