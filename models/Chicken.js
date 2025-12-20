import mongoose from 'mongoose';

const chickenSchema = new mongoose.Schema(
  {
    breed: { type: String, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Chicken', chickenSchema);
