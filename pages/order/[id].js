import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Main_Layout from '../../components/Main_Layout';
import { getError } from '../../utils/handle_error';

function reducer(state, action) {
  switch (action.type) {
    case 'REQUEST_PAYMENT':
      return { ...state, loadingPay: true };
    case 'PAYMENT_SUCCESSFUL':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAYMENT_FAILED':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'RESET_PAYMENT':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'REQUEST_F':
      return { ...state, loading: true, error: '' };
    case 'SUCCESS_F':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FAIL_F':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function PlaceOrder() {
  const { query } = useRouter();
  const orderId = query.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [
    { loading, error, order, paymentSuccessful, paymentProcessing },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'REQUEST_F' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'SUCCESS_F', payload: data });
      } catch (err) {
        dispatch({ type: 'FAIL_F', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      paymentSuccessful ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (paymentSuccessful) {
        dispatch({ type: 'RESET_PAYMENT' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/client/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paymentSuccessful, paypalDispatch]);

  const {
    deliveryAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    deliveryPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function OrderCase(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function ApproveCase(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'REQUEST_PAYMENT' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/payment`,
          details
        );
        dispatch({ type: 'PAYMENT_SUCCESSFUL', payload: data });
        toast.success('Order is paid successgully');
      } catch (err) {
        dispatch({ type: 'PAYMENT_FAILED', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function ErrorCase(err) {
    toast.error(getError(err));
  }
  return (
    <Main_Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {deliveryAddress.recipient}, {deliveryAddress.block},
                {deliveryAddress.room}
              </div>
              {isDelivered ? (
                <div className="success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="error">Not delivered</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="success">Paid at {paidAt}</div>
              ) : (
                <div className="error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          className="flex items-center"
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">₸{item.price}</td>
                      <td className="p-5 text-right">
                        ₸{item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₸{itemsPrice}</div>
                  </div>
                </li>{' '}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Delivery</div>
                    <div>₸{deliveryPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₸{totalPrice}</div>
                  </div>
                </li>
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Processing</div>
                    ) : (
                      <div className="w-full">
                        <PayPalButtons
                          PlaceOrder={OrderCase}
                          onApprove={ApproveCase}
                          onError={ErrorCase}
                        ></PayPalButtons>
                      </div>
                    )}
                    {paymentProcessing && <div>Processing...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Main_Layout>
  );
}

PlaceOrder.auth = true;
export default PlaceOrder;
