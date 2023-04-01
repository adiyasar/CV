import React from 'react';
import Main_Layout from '../../components/Main_Layout';
import Link from 'next/link';
import { useReducer } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { getError } from '../../utils/handle_error';
import { Rate } from 'antd';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, reviews: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function SellerReviews() {
  const [{ loading, error, reviews }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/review/getReviews`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  const desc = ['Terrible', 'Poor', 'Average', 'Very Good', 'Excellent'];
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
                    <th className="p-5 text-left">USER</th>
                    <th className="p-5 text-left">RATING</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">COMMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id} className="border-b">
                      <td className="p-5">{review.user_name}</td>
                      <td className="p-5">
                        <Rate
                          allowHalf
                          tooltips={desc}
                          disabled
                          defaultValue={review.rating}
                        />
                      </td>
                      <td className="p-5">
                        {review.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">{review.comment}</td>
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
