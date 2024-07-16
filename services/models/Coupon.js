import mongoose from "mongoose"

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    minPurchase: { type: Number, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, min: 0 },
    usageCount: { type: Number, default: 0 },
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Jersey" },
    ],
    eligibleEmails: [{ type: String }],
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingUsage: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema)
