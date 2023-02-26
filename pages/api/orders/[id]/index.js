import { getSession } from 'next-auth/react';
import Order from '../../../../Data/Order_model';
import db from '../../../../utils/mongoDB';

const orderPageHandler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await db.connect();

  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
};

export default orderPageHandler;
