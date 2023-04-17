import { getSession } from 'next-auth/react';
import Auction from '../../../../Data/Auction_model';
import db from '../../../../utils/mongoDB';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  console.log('BIDDER EMAIL:' + user.email);
  const { auction_item, new_bid } = req.body;
  console.log('Auction Item:' + auction_item);
  console.log('Auction Bid:' + new_bid);

  await db.connect();
  const toUpdateAuciton = await Auction.findOne({ slug: auction_item.slug });
  if (
    new_bid > toUpdateAuciton.current_bid &&
    new_bid > toUpdateAuciton.starting_price
  ) {
    toUpdateAuciton.current_bid = new_bid;
    toUpdateAuciton.current_bidder = user.email;
    toUpdateAuciton.current_bidder_id = user._id;
  }
  await toUpdateAuciton.save();
  await db.disconnect();
  res.send({
    message: 'Bid updated',
  });
};
export default handler;
