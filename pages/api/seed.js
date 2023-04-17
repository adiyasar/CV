import User from '../../Data/Users_model';
import db from '../../utils/mongoDB';
import data from '../../utils/data';
import Product from '../../Data/Product_model';
import Auction from '../../Data/Auction_model';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.items);
  await Auction.deleteMany();
  await Auction.insertMany(data.auctions);
  await db.disconnect();
  res.send({ message: 'operation successfull' });
};

export default handler;
