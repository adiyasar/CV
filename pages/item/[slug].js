import data from '../../utils/data';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Main_Layout from '../../components/Main_Layout';
import Image from 'next/image';
import { Shop } from '../../utils/Shop';

export default function ItemWindow() {
  const { state, dispatch } = useContext(Shop);
  const router = useRouter();
  const { query } = useRouter();
  const { slug } = query;
  const item = data.items.find((x) => x.slug === slug);
  if (!item) {
    return <div>Oops! Product does not exist</div>;
  }
  const addToCart = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (item.countInStock < quantity) {
      alert('Product is out of stock   :(\nCheck again later!');
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
    router.push('/shopping_cart');
  };
  return (
    <Main_Layout title={item.name}>
      <div className="py-2">
        <Link href="/">Back to Home</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={item.image}
            alt={item.name}
            width={840}
            height={840}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{item.name}</h1>
            </li>
            <li>Category: {item.category}</li>
            <li>Seller: {item.seller}</li>
            <li>
              Rating: {item.rating} ({item.numReviews} reviews)
            </li>
            <li>Description: {item.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price:</div>
              <div>₸ {item.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status:</div>
              <div>{item.countInStock > 0 ? 'Avaliable' : 'Sold out'}</div>
            </div>
            <button className="primary-button w-full" onClick={addToCart}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Main_Layout>
  );
}
