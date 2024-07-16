import dbConnect from "./db"
import Coupon from "./models/Coupon"

export async function createCoupon(couponData) {
  await dbConnect()

  const newCoupon = new Coupon(couponData)
  await newCoupon.save()

  return JSON.parse(JSON.stringify(newCoupon))
}

export async function getCouponByCode(code) {
  await dbConnect()

  const coupon = await Coupon.findOne({ code })
  return coupon ? JSON.parse(JSON.stringify(coupon)) : null
}


export async function getAllCoupons() {
  await dbConnect()

  const coupons = await Coupon.find({
    isActive: true,
    endDate: { $gt: new Date() },
  })

  return JSON.parse(JSON.stringify(coupons))
}

export async function updateCoupon(couponId, updateData) {
  await dbConnect()

  const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
    new: true,
  })
  return updatedCoupon ? JSON.parse(JSON.stringify(updatedCoupon)) : null
}

export async function deleteCoupon(couponId) {
  await dbConnect()

  const result = await Coupon.findByIdAndDelete(couponId)
  return result ? JSON.parse(JSON.stringify(result)) : null
}
