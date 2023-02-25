import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DeliveryHandler from '../components/DeliveryHandler';
import Main_Layout from '../components/Main_Layout';
import { Shop } from '../utils/Shop';

export default function OrderScreen() {
  const { state, dispatch } = useContext(Shop);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  const { cart } = state;
  const { deliveryAddress } = cart;
  const router = useRouter();
  useEffect(() => {
    setValue('recipient', deliveryAddress.recipient);
    setValue('block', deliveryAddress.block);
    setValue('room', deliveryAddress.room);
  }, [setValue, deliveryAddress]);

  const submitHandler = ({ recipient, block, room }) => {
    dispatch({
      type: 'SAVE_DELIVERY_DETAILS',
      payload: { recipient, block, room },
    });
    Cookies.set(
      'cart-items',
      JSON.stringify({
        ...cart,
        deliveryAddress: {
          recipient,
          block,
          room,
        },
      })
    );
    router.push('/checkout');
  };
  return (
    <Main_Layout title="Delivery">
      <DeliveryHandler activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Delivery Details</h1>
        <div className="mb-4">
          <label htmlFor="recipient">Recipients Name</label>
          <input
            className="w-full"
            id="recipient"
            autoFocus
            {...register('recipient', {
              required: 'Please enter recipient name',
            })}
          />
          {errors.recipient && (
            <div className="text-red-500">{errors.recipient.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Block:">Block (For example, D10):</label>
          <input
            className="w-full"
            id="block"
            autoFocus
            {...register('block', {
              required: 'Please enter block number',
              minLength: {
                value: 2,
                message: 'Block number should be more than 1 chars',
              },
            })}
          />
          {errors.block && (
            <div className="text-red-500 ">{errors.block.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Room:">Room</label>
          <input
            className="w-full"
            type="number"
            id="room"
            min="0"
            step="1"
            {...register('room', {
              required: 'Please enter room number',
              minLength: {
                value: 3,
                message: 'Room number should be at least 3 digits',
              },
            })}
          />
          {errors.room && (
            <div className="text-red-500">{errors.room.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Main_Layout>
  );
}

OrderScreen.auth = true;
