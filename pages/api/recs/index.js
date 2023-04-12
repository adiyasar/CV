import { getSession } from 'next-auth/react';
import db from '../../../utils/mongoDB';
import User from '../../../Data/Users_model';
import Product from '../../../Data/Product_model';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Login fail' });
  }
  const { user } = session;
  await db.connect();
  const user_data = await User.find({ email: user.email });
  const tags = user_data.favourite_tags;
  const recs = await Product.find({ category: { $in: [tags] } });
  await db.disconnect();
  res.send(recs);
};

export default handler;
