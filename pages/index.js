import Main_Layout from '../components/Main_Layout';
import ItemPage from '../components/ItemPage';
import Product from '../Data/Product_model';
import db from '../utils/mongoDB';
import { useContext } from 'react';
import { Shop } from '../utils/Shop';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Home({ items }) {
  const { state, dispatch } = useContext(Shop);
  const { cart } = state;

  const addToCart = async (item) => {
    const existItem = cart.cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/items/${item._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Product is out of stock   :(\nCheck again later!');
    }

    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
    toast.success('Added to cart');
  };
  return (
    <Main_Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
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

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      items: products.map(db.convertDocToObj),
    },
  };
}
