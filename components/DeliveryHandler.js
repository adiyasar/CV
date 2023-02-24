import React from 'react';

export default function DeliveryHandler({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {['Login', 'Delivery', 'Checkout', 'Place Order'].map((step, index) => (
        <div
          key={step}
          className={`flex-1 border-b-2  
          text-center 
       ${
         index <= activeStep
           ? 'border-yellow-500   text-yellow-500'
           : 'border-gray-400 text-gray-400'
       }
          
       `}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
