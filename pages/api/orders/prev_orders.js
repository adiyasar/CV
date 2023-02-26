import { getSession } from 'next-auth/react';
import Order from '../../../Data/Order_model';
import db from '../../../utils/mongoDB';

const prevOrdersHandler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Login fail' });
  }
  const { user } = session;
  await db.connect();
  const orders = await Order.find({ user: user._id });
  await db.disconnect();
  res.send(orders);
};

export default prevOrdersHandler;
