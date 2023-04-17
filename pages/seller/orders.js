import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Main_Layout from '../../components/Main_Layout';
import { getError } from '../../utils/handle_error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function SellerOrders() {
  const { data: session } = useSession();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/seller/orders`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  const DeliveryCheck = async (order) => {
    var code = prompt('Please enter confirmation code');
    if (code != null) {
      for (let seller of order.sellers) {
        if (seller.testCode === code && session.user.name === seller.name) {
          try {
            const order_data = order;
            await axios.put('/api/seller/delivery', {
              order_data,
            });
            document.location.reload();
          } catch (err) {
            toast.error(getError(err));
          }
          return;
        } else if (session.user.name === seller.name) {
          toast.error('Wrong code!');
        }
      }
    } else {
      toast.error('Please provide a proper code!');
    }
  };

  return (
    <Main_Layout title="Seller Page">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/seller/menu">Overview</Link>
            </li>
            <li>
              <Link className="font-bold" href="/seller/orders">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/seller/products">Products</Link>
            </li>
            <li>
              <Link href="/seller/auctions">Auctions</Link>
            </li>
            <li>
              <Link href="/seller/reviews">Reviews</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Seller Orders</h1>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">USER</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">TOTAL</th>
                    <th className="p-5 text-left">PAID</th>
                    <th className="p-5 text-left">DELIVERY</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : 'DELETED USER'}
                      </td>
                      <td className="p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">₸{order.totalPrice}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? `${order.paidAt.substring(0, 10)}`
                          : 'Not Paid'}
                      </td>
                      <td className="p-5">
                        {order.sellers.find(
                          (x) => x.email === session.user.email
                        ).sellerDelivered ? (
                          <h1 className="success w-24">Delivered</h1>
                        ) : (
                          <button
                            id="delivery_button"
                            className="primary-button"
                            type="button"
                            onClick={() => DeliveryCheck(order)}
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Main_Layout>
  );
}

SellerOrders.auth = true;
