// app/api/orders/route.js
// import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
// import { authOptions } from "../auth/[...nextauth]/options"
import {
  getAllOrders,
  getOrderDetails,
  statusUpdate,
  statusRemove,
} from "@/services/orderService"

export async function GET(request) {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    try {
      const order = await getOrderDetails(id)
      return NextResponse.json(order)
    } catch (error) {
      console.error("Failed to fetch order details:", error)
      return NextResponse.json(
        { error: "Failed to fetch order details" },
        { status: 500 }
      )
    }
  }

  try {
    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch order history:", error)
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const {status} = await request.json()
  console.log("status",status);
  try {
    const order = await statusUpdate(id, status)
    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to update order status:", error)
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  try {
    const order = await statusRemove(id)
    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to remove order status:", error)
    return NextResponse.json(
      { error: "Failed to remove order status" },
      { status: 500 }
    )
  }
}

