import { getSession } from 'next-auth/react';
import Order from '../../../Data/Order_model';
import Product from '../../../Data/Product_model';
import User from '../../../Data/Users_model';
import db from '../../../utils/mongoDB';

const sellerHandle = async (req, res) => {
  const session = await getSession({ req });

  console.log(session);
  if (!session) {
    return res.status(401).send('signin required');
  }
  const { user } = session;
  await db.connect();

  const ordersCount = await Order.countDocuments({ user: user._id });
  console.log(user.name);
  const productsCount = await Product.countDocuments({
    seller: { $regex: user.name },
  });
  const usersCount = await User.countDocuments();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

export default sellerHandle;
