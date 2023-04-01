import { getSession } from 'next-auth/react';
import db from '../../../utils/mongoDB';
import Review from '../../../Data/Reviews_model';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Login fail' });
  }
  const { user } = session;
  await db.connect();
  const reviews = await Review.find({ user: user._id });
  await db.disconnect();
  res.send(reviews);
};

export default handler;
