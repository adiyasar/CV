import User from '../../../Data/Users_model';
import db from '../../../utils/mongoDB';
import bcryptjs from 'bcryptjs';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@nu.edu.kz') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: 'Error: incorrect data format',
    });
    return;
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isSeller: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: 'New user',
    _id: user._id,
    name: user.name,
    email: user.email,
    isSeller: user.isSeller,
  });
}

export default handler;
