import React, { useState } from 'react';

const BillingDetailsForm = () => {
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  return (
    <form className="billing-details-form">
      <h2>Billing Details</h2>
      <input type="text" name="name" value={billingInfo.name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="address" value={billingInfo.address} onChange={handleChange} placeholder="Address" required />
      <input type="text" name="city" value={billingInfo.city} onChange={handleChange} placeholder="City" required />
      <input type="text" name="zip" value={billingInfo.zip} onChange={handleChange} placeholder="ZIP Code" required />
    </form>
  );
};

export default BillingDetailsForm;
