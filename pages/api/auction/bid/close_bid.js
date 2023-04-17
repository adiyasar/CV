import { getSession } from 'next-auth/react';
import Auction from '../../../../Data/Auction_model';
import db from '../../../../utils/mongoDB';
import Order from '../../../../Data/Order_model';
import User from '../../../../Data/Users_model';

const compareDates = (d1, d2) => {
  let date1 = d1.getTime();
  let date2 = d2.getTime();

  if (date1 < date2) {
    console.log(`${d1} is less than ${d2}`);
    return -1;
  } else if (date1 > date2) {
    console.log(`${d1} is greater than ${d2}`);
    return 1;
  } else {
    console.log(`Both dates are equal`);
    return 0;
  }
};

function createTestCode(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const handler = async (req, res) => {
  console.log('Close_Bid');

  const { auction_item } = req.body;

  console.log('Data:' + auction_item);
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }
  const { user } = session;
  console.log('Auction Item:' + auction_item);

  await db.connect();
  const toUpdateAuciton = await Auction.findOne({ slug: auction_item.slug });
  const buyer = await User.findOne({ email: toUpdateAuciton.current_bidder });
  const seller = await User.findOne({ email: toUpdateAuciton.seller_email });
  console.log('Seller: ' + seller);
  console.log('Buyer: ' + buyer);
  const current_date = new Date();
  console.log('Timer');
  console.log(toUpdateAuciton.timer);
  console.log('Date:');
  console.log(current_date);
  const test_dates = compareDates(toUpdateAuciton.timer, current_date);
  console.log('Compate dates' + test_dates);
  toUpdateAuciton.active = false;
  if (toUpdateAuciton.current_bid > 0) {
    if (test_dates < 0) {
      console.log('Auction expired');
    } else {
      console.log('Auction manually closed');

      var code = createTestCode(5);
      const newOrder = new Order({
        user: user._id,
        sellers: [
          {
            name: seller.name,
            email: seller.email,
            testCode: code,
            sellerDelivered: false,
            sellerReviewed: false,
          },
        ],
        orderItems: [
          {
            name: toUpdateAuciton.name,
            quantity: 1,
            image: toUpdateAuciton.image,
            price: toUpdateAuciton.current_bid,
          },
        ],
        deliveryAddress: {
          recipient: buyer.name,
          block: 'TBD',
          room: 1,
        },
        paymentMethod: 'PayPal',

        itemsPrice: toUpdateAuciton.current_bid,
        deliveryPrice: 0,
        totalPrice: toUpdateAuciton.current_bid,
      });
      const order = await newOrder.save();
      console.log('Order created: ' + order);
    }
  }
  await toUpdateAuciton.save();
  await db.disconnect();
  res.send({
    message: 'Auction Closed',
  });
};
export default handler;
