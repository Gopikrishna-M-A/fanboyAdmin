// import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { getUsers, updateUser } from "@/services/userService" // Importing team functions
// import { authOptions } from "../auth/[...nextauth]/options"

export async function GET(request) {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }
  try {
    const users = await getUsers()
    return NextResponse.json( users )
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userData = await request.json()
  try {
    const user = await updateUser(session.user.id,userData)
    return NextResponse.json( user )
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}
