import React, { useState } from 'react';
import BillingDetailsForm from '../components/Checkout/BillingDetailsForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import PaymentSection from '../components/Checkout/PaymentSection';
import Confirmation from '../components/Checkout/Confirmation';

const CheckoutPage = () => {
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrderPlacement = () => {
    // Logic to place the order and handle payment
    setOrderPlaced(true); // Set to true on successful payment
  };

  return (
    <div className="checkout-page">
      {orderPlaced ? (
        <Confirmation />
      ) : (
        <>
          <BillingDetailsForm />
          <OrderSummary />
          <PaymentSection onOrderPlaced={handleOrderPlacement} />
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
