import { getSession } from 'next-auth/react';
import db from '../../../utils/mongoDB';
import User from '../../../Data/Users_model';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;

  await db.connect();
  const user_data = await User.findOne({ email: user.email });
  await db.disconnect();
  res.send({
    user: user_data,
  });
};
export default handler;
