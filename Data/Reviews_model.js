import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user_name: { type: String, required: true },
    seller_email: {
      type: String,
      required: true,
    },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
