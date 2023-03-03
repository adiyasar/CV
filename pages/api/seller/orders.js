import { getSession } from 'next-auth/react';
import Order from '../../../Data/Order_model';
import db from '../../../utils/mongoDB';

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { user } = session;
  if (!session) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    await db.connect();
    const orders = await Order.find({
      sellers: { $elemMatch: { email: user.email } },
    }).populate('user', 'name');
    await db.disconnect();
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
