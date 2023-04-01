import { getSession } from 'next-auth/react';
import Order from '../../../Data/Order_model';
import Review from '../../../Data/Reviews_model';
import User from '../../../Data/Users_model';
import db from '../../../utils/mongoDB';

const reviewHandle = async (req, res) => {
  const { orderId, rating, comment, sellerEmail } = req.body;
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }
  if (!rating || !comment) {
    res.status(422).json({
      message: 'Error: incorrect data format',
    });
    return;
  }
  var rating_val = 0;
  if (rating === 'Excellent') {
    rating_val = 5;
  } else if (rating === 'Very Good') {
    rating_val = 4;
  } else if (rating === 'Average') {
    rating_val = 3;
  } else if (rating === 'Poor') {
    rating_val = 2;
  } else if (rating === 'Terrible') {
    rating_val = 1;
  } else {
    rating_val = 'Error';
  }
  const { user } = session;
  await db.connect();
  console.log('Connection succesufll');
  const newReview = new Review({
    user: user._id,
    user_name: user.name,
    seller_email: sellerEmail,
    rating: rating_val,
    comment: comment,
    order: orderId,
  });

  const review = await newReview.save();

  var test = true;
  const query = {
    _id: orderId,
    'sellers.email': sellerEmail,
  };
  console.log('Query:' + query);
  const updateOrder = { $set: { 'sellers.$.sellerReviewed': true } };
  console.log('updateOrder:' + updateOrder);
  const result = await Order.updateOne(query, updateOrder);
  console.log(result);
  const toUpdateOrder = await Order.findById(orderId);
  for (let seller of toUpdateOrder.sellers) {
    if (seller.sellerReviewed === false) {
      test = false;
      break;
    }
  }
  if (test === true) {
    toUpdateOrder.sellerReviewed = true;
    await toUpdateOrder.save();
  }

  const toReviewUser = await User.findOne({ email: { $regex: sellerEmail } });
  var current_rating = toReviewUser.rating;
  var current_num_Reviews = toReviewUser.numReviews;

  const new_rating = current_rating * current_num_Reviews + rating_val;
  const new_num_Reviews = current_num_Reviews + 1;

  toReviewUser.rating = new_rating / new_num_Reviews;
  toReviewUser.numReviews = new_num_Reviews;

  await toReviewUser.save();

  await db.disconnect();
  res.status(201).send(review);
};
export default reviewHandle;
