import React from 'react';

const PaymentSection = ({ onOrderPlaced }) => {
  const handlePayment = () => {
    // Logic to handle payment, e.g., integrate with Stripe/PayPal
    onOrderPlaced(); // Call the function after payment is successful
  };

  return (
    <div className="payment-section">
      <h2>Payment</h2>
      <button onClick={handlePayment}>Place Order</button>
    </div>
  );
};

export default PaymentSection;
