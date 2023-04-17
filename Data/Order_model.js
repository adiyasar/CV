import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    sellers: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        testCode: { type: String, required: true },
        sellerDelivered: { type: Boolean, required: true, default: false },
        sellerReviewed: { type: Boolean, required: true, default: false },
      },
    ],
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    deliveryAddress: {
      recipient: { type: String, required: true },
      block: { type: String, required: true },
      room: { type: Number, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    deliveryPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
