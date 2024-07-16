import { NextResponse } from "next/server"
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '@/services/couponServices'

export async function GET(request) {
  
    try {
      const coupons = await getAllCoupons()
      return NextResponse.json(coupons)
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
      return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
    }
  }
  



export async function PATCH(request) {
  const { id, ...updateData } = await request.json()

  try {
    const updatedCoupon = await updateCoupon(id, updateData)
    return NextResponse.json(updatedCoupon)
  } catch (error) {
    console.error("Failed to update coupon:", error)
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
  }
}

export async function POST(request) {

  const couponData = await request.json()

  try {
    const newCoupon = await createCoupon(couponData)
    return NextResponse.json(newCoupon)
  } catch (error) {
    console.error("Failed to create coupon:", error)
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  try {
    const jersey = await deleteCoupon(id)
    if (!jersey) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }
    return NextResponse.json( jersey )
  } catch (error) {
    console.error("Failed to delete coupon:", error)
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    )
  }
}
