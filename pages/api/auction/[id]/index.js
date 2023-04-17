import { getSession } from 'next-auth/react';
import Auction from '../../../../Data/Auction_model';
import db from '../../../../utils/mongoDB';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }
  await db.connect();
  const auction = await Auction.findOne({ slug: req.query.id });
  console.log('Auctionm found + ' + req.query.id);
  await db.disconnect();

  const { user } = session;
  if (auction.seller_email === user.email) {
    console.log('Same user');
    console.log('Seller: ' + auction);
    console.log('User: ' + user);
    res.send({
      isSeller: true,
      user,
    });
    return true;
  } else {
    res.send({
      isSeller: false,
      user,
    });
  }
};
export default handler;
