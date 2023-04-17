import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    starting_price: { type: Number, required: true },
    seller: { type: String, required: true },
    seller_email: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    reviews: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    numReviews: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
    current_bid: { type: Number, required: true, default: 0 },
    current_bidder: { type: String, required: true, default: 'None' },
    current_bidder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timer: {
      type: Date,
      required: true,
      default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

const Auction =
  mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
export default Auction;
