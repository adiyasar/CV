import User from '../../Data/Users_model';
import db from '../../utils/mongoDB';
import data from '../../utils/data';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await db.disconnect();
  res.send({ message: 'operation successfull' });
};

export default handler;
