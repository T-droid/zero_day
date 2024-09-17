import React from 'react';

const OrderSummary = () => {
  // Sample data, replace with actual cart data
  const cartItems = [
    { name: 'Product 1', price: 20 },
    { name: 'Product 2', price: 30 },
  ];
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {cartItems.map((item, index) => (
        <div key={index}>
          <span>{item.name}</span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      ))}
      <div>
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default OrderSummary;
