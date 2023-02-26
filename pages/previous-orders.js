import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Main_Layout from '../components/Main_Layout';
import { getError } from '../utils/handle_error';

function reducer(state, action) {
  switch (action.type) {
    case 'REQUEST_F':
      return { ...state, loading: true, error: '' };
    case 'SUCCESS_F':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FAIL_F':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function PreviousOrders() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'REQUEST_F' });
        const { data } = await axios.get(`/api/orders/prev_orders`);
        dispatch({ type: 'SUCCESS_F', payload: data });
      } catch (err) {
        dispatch({ type: 'FAIL_F', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Main_Layout title="Order History">
      <h1 className="mb-4 text-xl">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">Order number:</th>
                <th className="p-5 text-left">Ordered at:</th>
                <th className="p-5 text-left">PAYMENT:</th>
                <th className="p-5 text-left">PAYMENT STATUS:</th>
                <th className="p-5 text-left">DELIVERY STATUS:</th>
                <th className="p-5 text-left">DETAILS:</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className=" p-5 ">{order._id.substring(20, 24)}</td>
                  <td className=" p-5 ">{order.createdAt.substring(0, 10)}</td>
                  <td className=" p-5 ">₸{order.totalPrice}</td>
                  <td className=" p-5 ">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : 'not paid'}
                  </td>
                  <td className=" p-5 ">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className=" p-5 ">
                    <Link
                      className="link"
                      href={`/order/${order._id}`}
                      passHref
                    >
                      About
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Main_Layout>
  );
}
PreviousOrders.auth = true;
export default PreviousOrders;
