import { getSession } from 'next-auth/react';
import Order from '../../../Data/Order_model';
import db from '../../../utils/mongoDB';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  var order_info = req.body;
  console.log('------------------------------------');
  console.log(order_info.order_data._id);
  order_info = order_info.order_data._id;
  console.log('------------------------------------');
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;

  await db.connect();
  var test = true;
  const query = {
    _id: order_info,
    'sellers.email': user.email,
  };
  console.log('Query:' + query);
  const updateOrder = { $set: { 'sellers.$.sellerDelivered': true } };
  console.log('updateOrder:' + updateOrder);
  const result = await Order.updateOne(query, updateOrder);
  console.log(result);
  const toUpdateOrder = await Order.findById(order_info);
  for (let seller of toUpdateOrder.sellers) {
    if (seller.sellerDelivered === false) {
      test = false;
      break;
    }
  }
  if (test === true) {
    toUpdateOrder.isDelivered = true;
    toUpdateOrder.deliveredAt = Date.now();
    await toUpdateOrder.save();
  }
  await db.disconnect();
  res.send({
    message: 'Delivery status updated',
  });
};

export default handler;
