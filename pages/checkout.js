import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DeliveryHandler from '../components/DeliveryHandler';
import Main_Layout from '../components/Main_Layout';
import { Shop } from '../utils/Shop';

export default function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { state, dispatch } = useContext(Shop);
  const { cart } = state;
  const { deliveryAddress, paymentMethod } = cart;

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Please select payment');
    }
    dispatch({ type: 'SAVE_CHECKOUT', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push('/placeorder');
  };
  useEffect(() => {
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, deliveryAddress.room]);

  return (
    <Main_Layout title="checkout">
      <DeliveryHandler activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit}>
        <h1 className="text-xl mb-4">How would you like to pay?</h1>
        {['PayPal', 'CashOnDelivery'].map((checkout) => (
          <div key={checkout} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={checkout}
              type="radio"
              checked={selectedPaymentMethod === checkout}
              onChange={() => setSelectedPaymentMethod(checkout)}
            />

            <label className="p-2" htmlFor={checkout}>
              {checkout}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/shipping')}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Main_Layout>
  );
}
