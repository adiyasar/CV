import Link from 'next/link';
import React, { useContext } from 'react';
import Main_Layout from '../components/Main_Layout';
import { Shop } from '../utils/Shop';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

function ShoppingCart() {
  const { state, dispatch } = useContext(Shop);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;
  const deleteItem = (item) => {
    dispatch({ type: 'DELETE_ITEM', payload: item });
  };
  const updateCartValue = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/items/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Error. Out of stock');
    }
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
    toast.success('Added to cart');
  };
  return (
    <Main_Layout title="Shopping_Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Empty Cart <Link href="/">Go back to shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
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
                    <td className="p-5 text-right">
                      <select
                        className="bg-white"
                        value={item.quantity}
                        onChange={(e) => updateCartValue(item, e.target.value)}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">₸ {item.price}</td>
                    <td className="p-5 text-center">
                      <button
                        className="primary-button "
                        onClick={() => deleteItem(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Total ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : ₸{' '}
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() =>
                    router.push('user_login?redirect=/order_screen')
                  }
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Main_Layout>
  );
}
export default dynamic(() => Promise.resolve(ShoppingCart), { ssr: false });
