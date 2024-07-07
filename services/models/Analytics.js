import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
    }, // e.g., "Page View", "Product Click", "Add to Cart"
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    eventData: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
)

export default mongoose.models.Analytics ||
  mongoose.model("Analytics", analyticsSchema)
