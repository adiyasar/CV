import { getSession } from 'next-auth/react';
import Product from '../../../Data/Product_model';
import db from '../../../utils/mongoDB';
function slugGenerator(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
async function handler(req, res) {
  const { name, price, category, image, countInStock, description } = req.body;
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
  if (!name || !price || !category || !image || !countInStock) {
    res.status(422).json({
      message: 'Error: incorrect data format',
    });
    return;
  }
  await db.connect();
  const newProduct = new Product({
    name,
    slug,
    category,
    image,
    price,
    seller: user.name,
    seller_email: user.email,
    rating: 0.0,
    numReviews: 0,
    countInStock,
    description,
  });
  const item = await newProduct.save();
  await db.disconnect();
  res.status(201).send({
    message: 'New item',
    _id: item._id,
    name: item.name,
    email: item.seller_email,
  });
}
export default handler;
