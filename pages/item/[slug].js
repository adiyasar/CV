import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Rate } from 'antd';
import Main_Layout from '../../components/Main_Layout';
import ItemPage from '../../components/ItemPage';
import { Shop } from '../../utils/Shop';
import db from '../../utils/mongoDB';
import Product from '../../Data/Product_model';
import axios from 'axios';
import { toast } from 'react-toastify';
import User from '../../Data/Users_model';

export default function ItemWindow(props) {
  const { item, seller, recs } = props;
  var top_items = recs.filter(function (obj) {
    return obj.slug !== item.slug;
  });
  if (top_items.length > 7) {
    top_items = top_items.slice(0, 8);
  }
  console.log('Data:');
  console.log(seller);
  const { state, dispatch } = useContext(Shop);
  const router = useRouter();
  function roundToHalf(value) {
    var converted = parseFloat(value);
    var decimal = converted - parseInt(converted, 10);
    decimal = Math.round(decimal * 10);
    if (decimal == 5) {
      return parseInt(converted, 10) + 0.5;
    }
    if (decimal < 3 || decimal > 7) {
      return Math.round(converted);
    } else {
      return parseInt(converted, 10) + 0.5;
    }
  }
  if (!item) {
    return (
      <Main_Layout title="Error">Oops! Product does not exist</Main_Layout>
    );
  }

  const addToCart = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/items/${item._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Product is out of stock  :(\nCheck again later!');
    }
    console.log({ ...item, quantity });
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
    router.push('/shopping_cart');
  };
  const desc = ['Terrible', 'Poor', 'Average', 'Very Good', 'Excellent'];
  return (
    <Main_Layout title={item.name}>
      <div className="py-2">
        <Link className="link text-lg" href="/">
          {String.fromCharCode(8592)} Back
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          {/* <Image
            src={item.image}
            alt={item.name}
            width={840}
            height={840}
            layout="responsive"
          ></Image> */}
          <object
            className="custom_obj"
            data={item.image}
            width={640}
            height={540}
          ></object>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{item.name}</h1>
            </li>
            <li>Category: {item.category}</li>
            <li>Seller: {item.seller}</li>
            <li>
              Seller Rating: <></>
              <Rate
                allowHalf
                tooltips={desc}
                disabled
                defaultValue={roundToHalf(seller.rating)}
              />
              ({seller.numReviews} reviews)
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
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <h2>Reccomendaitons:</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {top_items.map((item) => (
          <ItemPage
            item={item}
            key={item.slug}
            addToCart={addToCart}
          ></ItemPage>
        ))}
      </div>
    </Main_Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  console.log('User:');

  await db.connect();
  const product = await Product.findOne({ slug }).lean();

  const seller = await User.findOne({ email: product.seller_email }).lean();

  const tags = seller.favourite_tags;
  const tag1 = tags[0];
  const tag2 = tags[1];
  const tag3 = tags[2];
  const recs = await Product.find({
    category: { $in: [tag1, tag2, tag3] },
  }).lean();
  console.log(recs);

  await db.disconnect();
  return {
    props: {
      item: product ? db.convertDocToObj(product) : null,
      seller: seller ? db.convertDocToObj(seller) : null,
      recs: recs.map(db.convertDocToObj),
    },
  };
}
