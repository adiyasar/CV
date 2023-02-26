import { getSession } from 'next-auth/react';
import Order from '../../../../Data/Order_model';
import db from '../../../../utils/mongoDB';

const paymantHandler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Error: signin required');
  }

  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: 'Error: order is already paid' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'Payment Successful', order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found. ERROR!' });
  }
};

export default paymantHandler;
