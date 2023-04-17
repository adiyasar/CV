import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { getError } from '../../utils/handle_error';
import { toast } from 'react-toastify';
import Main_Layout from '../../components/Main_Layout';
import Link from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      state;
  }
}
export default function SellerAuction() {
  const [{ loading, error, products, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      products: [],
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/seller/auctions`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (auctionId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/auction/delete/${auctionId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('AuctionId deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Main_Layout title="Seller Products">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/seller/menu">Overview</Link>
            </li>
            <li>
              <Link href="/seller/orders">Orders</Link>
            </li>
            <li>
              <Link href="/seller/products">Products</Link>
            </li>
            <li>
              <Link className="font-bold" href="/seller/auctions">
                Auctions
              </Link>
            </li>
            <li>
              <Link href="/seller/reviews">Reviews</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Products</h1>
            <Link
              type="button"
              className="primary-button"
              href={`/seller/createAuction`}
            >
              Add
            </Link>
          </div>
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
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">CATEGORY</th>
                    <th className="p-5 text-left">STARTING PRICE</th>
                    <th className="p-5 text-left">CURRENT BID</th>
                    <th className="p-5 text-left">STATUS</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((auction) => (
                    <tr key={auction._id} className="border-b">
                      <td className=" p-5 ">{auction._id.substring(20, 24)}</td>
                      <td className=" p-5 ">{auction.name}</td>
                      <td className=" p-5 ">{auction.category}</td>
                      <td className=" p-5 ">₸{auction.starting_price}</td>
                      <td className=" p-5 ">{auction.current_bid}</td>
                      <td className=" p-5 ">
                        {auction.active ? 'Active' : 'Closed'}
                      </td>
                      <td className=" p-5 ">
                        <Link
                          type="button"
                          className="primary-button"
                          href={`/seller/auction/${auction._id}`}
                        >
                          View
                        </Link>
                        <div> &nbsp;</div>

                        <button
                          onClick={() => deleteHandler(auction._id)}
                          className="def-button "
                          type="button"
                        >
                          Delete
                        </button>
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
SellerAuction.auth = true;
