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

  const ordersCount = await Order.countDocuments({
    sellers: { $elemMatch: { email: user.email } },
  });
  console.log(user.name);
  const productsCount = await Product.countDocuments({
    seller: { $regex: user.name },
  });
  const usersCount = await User.countDocuments();

  const orders_with_seller = await Order.find({
    sellers: { $elemMatch: { email: user.email } },
  });
  const sellers_products = await Product.find({
    seller: { $regex: user.name },
  });
  var sum = 0;
  var sales = [];
  for (let order of orders_with_seller) {
    var sum_for_order = 0;
    for (let item of order.orderItems) {
      for (let product of sellers_products) {
        if (product._id.equals(item._id)) {
          sum += item.quantity * item.price;
          sum_for_order += item.quantity * item.price;
        }
      }
    }

    var time_of_sale_month = order.createdAt.getMonth();
    if (Number(time_of_sale_month) < 10) {
      time_of_sale_month = '0' + time_of_sale_month;
    }
    var time_of_sale_year = order.createdAt.getFullYear();
    var time_of_sale = time_of_sale_year + '-' + time_of_sale_month;
    console.log('Push time: ' + time_of_sale);
    console.log('Push price: ' + sum_for_order);
    sales.push({
      _id: time_of_sale,
      totalSales: sum_for_order,
    });
  }
  const res_after = Array.from(
    sales.reduce(
      (m, { _id, totalSales }) => m.set(_id, (m.get(_id) || 0) + totalSales),
      new Map()
    ),
    ([_id, totalSales]) => ({ _id, totalSales })
  );

  const ordersPrice = sum;
  const salesData = res_after;
  console.log('Sales:' + res);

  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

export default sellerHandle;
