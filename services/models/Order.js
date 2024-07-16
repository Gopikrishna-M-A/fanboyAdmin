import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jerseys: [
    {
      jersey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jersey",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size:{
        type:String,
        required:true
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  payment: {
    type: String
    // enum: ["Pending", "Paid", "Cancelled"],
    // default: "Pending",
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    }
  },
  orderStatus: [
    {
      status: {
        type: String,
        enum: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded", "Completed"],
        default: "Processing",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      desc:{
        type:String,
        default:"Your order is confirmed and in processing. Thank you for your patience."
      }
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentId: String,
  OrderId: String,
  signature: String,
  method: String,
  orderNumber: {
    type: String,
    required: true,
  },
  DeliverType:{
    type:String,
    enum:["Delivery","Pickup"],
    default:"Delivery"
  },
  subTotal: {
    type: Number,
    required: true,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  coupon:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  }


});


export default mongoose.models.Order || mongoose.model("Order", orderSchema)

