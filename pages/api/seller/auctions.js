import { getSession } from 'next-auth/react';
import db from '../../../utils/mongoDB';
import Auction from '../../../Data/Auction_model';

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { user } = session;
  if (!session) {
    return res.status(401).send('user signin required');
  }
  if (req.method === 'GET') {
    await db.connect();
    const products = await Auction.find({ seller_email: user.email });
    await db.disconnect();
    res.send(products);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
