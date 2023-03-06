import { getSession } from 'next-auth/react';
import Product from '../../../Data/Product_model';
import db from '../../../utils/mongoDB';

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { user } = session;
  if (!session) {
    return res.status(401).send('user signin required');
  }
  if (req.method === 'GET') {
    await db.connect();
    const products = await Product.find({ seller_email: user.email });
    await db.disconnect();
    res.send(products);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
