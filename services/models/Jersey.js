import mongoose from 'mongoose';

const JerseySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['international', 'club'] },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  variant: { type: String, required: true, enum: ['firstcopy', 'master', 'player'] },
  costPrice: { type: Number, min: 0 },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  images: { type: [String] },
  reorderPoint: { type: Number, min: 1, default: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

JerseySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Jersey || mongoose.model('Jersey', JerseySchema);
