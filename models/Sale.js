import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  chicken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chicken',
    required: true
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  customer: { type: String },
  soldAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Sale', saleSchema);
