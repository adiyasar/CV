import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, required: true, default: false },
    rating: { type: Number, required: true, default: 0 },
    reviews: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    numReviews: { type: Number, required: true, default: 0 },
    favourite_tags: {
      type: [
        {
          type: String,
          // Another properties
        },
      ],
      default: ['Clothes', 'Food', 'Tech'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
