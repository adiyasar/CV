import { getSession } from 'next-auth/react';

const keysHandle = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Please Login');
  }
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
};
export default keysHandle;
