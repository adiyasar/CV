import { getSession } from 'next-auth/react';
import db from '../../../utils/mongoDB';
import Auction from '../../../Data/Auction_model';
function slugGenerator(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
async function handler(req, res) {
  const { name, price, category, image, description } = req.body;
  var slug = slugGenerator(name);
  if (req.method !== 'POST') {
    return;
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }
  const { user } = session;
  console.log('Test User');
  if (!name || !price || !category || !image) {
    res.status(422).json({
      message: 'Error: incorrect data format',
    });
    return;
  }
  await db.connect();
  const newAuction = new Auction({
    name,
    slug,
    category,
    image,
    starting_price: price,
    seller: user.name,
    seller_email: user.email,
    rating: 0.0,
    numReviews: 0,

    description,
  });
  const item = await newAuction.save();
  await db.disconnect();
  res.status(201).send({
    message: 'New item',
    _id: item._id,
    name: item.name,
    email: item.seller_email,
  });
}
export default handler;
