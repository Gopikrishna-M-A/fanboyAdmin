// import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import {
  getJerseys,
  getJerseyById,
  createJersey,
  deleteJersey,
} from "@/services/jerseyService" // Importing jersey functions
// import { authOptions } from "../auth/[...nextauth]/options"

export async function GET(request) {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // If an ID is provided, fetch a single jersey
  if (id) {
    try {
      const jersey = await getJerseyById(id)
      if (!jersey) {
        return NextResponse.json({ error: "Jersey not found" }, { status: 404 })
      }
      return NextResponse.json({ jersey })
    } catch (error) {
      console.error("Failed to fetch jersey:", error)
      return NextResponse.json(
        { error: "Failed to fetch jersey" },
        { status: 500 }
      )
    }
  }

  const limit = 10
  const page = 1

  try {
    const jerseys = await getJerseys(limit, page)
    return NextResponse.json(jerseys)
  } catch (error) {
    console.error("Failed to fetch jerseys:", error)
    return NextResponse.json(
      { error: "Failed to fetch jerseys" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }

  const jerseyData = await request.json()

  try {
    const jersey = await createJersey(jerseyData)
    return NextResponse.json({ jersey })
  } catch (error) {
    console.error("Failed to create jersey:", error)
    return NextResponse.json(
      { error: "Failed to create jersey" },
      { status: 500 }
    )
  }
}


export async function PUT(request) {
    const jerseyData = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    try {
      const jersey = await updateJersey(id, jerseyData)
      if (!jersey) {
        return NextResponse.json({ error: "Jersey not found" }, { status: 404 })
      }
      return NextResponse.json( jersey )
    } catch (error) {
      console.error("Failed to update jersey:", error)
      return NextResponse.json(
        { error: "Failed to update jersey" },
        { status: 500 }
      )
    }
  }


  export async function DELETE(request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    console.log("jersey roite id",id);
    try {
      const jersey = await deleteJersey(id)
      if (!jersey) {
        return NextResponse.json({ error: "Jersey not found" }, { status: 404 })
      }
      return NextResponse.json( jersey )
    } catch (error) {
      console.error("Failed to delete jersey:", error)
      return NextResponse.json(
        { error: "Failed to delete jersey" },
        { status: 500 }
      )
    }
  }
