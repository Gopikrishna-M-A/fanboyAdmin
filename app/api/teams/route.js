// import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { getAllTeams, getTeamById, createTeam, deleteTeam } from "@/services/teamService" // Importing team functions
// import { authOptions } from "../auth/[...nextauth]/options"

export async function GET(request) {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    try {
      const team = await getTeamById(id)
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 })
      }
      return NextResponse.json({ team })
    } catch (error) {
      console.error("Failed to fetch team:", error)
      return NextResponse.json(
        { error: "Failed to fetch team" },
        { status: 500 }
      )
    }
  }

  const limit = 10
  const page = 1

  try {
    const teams = await getAllTeams(limit, page)
    return NextResponse.json( teams )
  } catch (error) {
    console.error("Failed to fetch teams:", error)
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }
  const teamData = await request.json()

  try {
    const team = await createTeam(teamData)
    return NextResponse.json( team )
  } catch (error) {
    console.error("Failed to create team:", error)
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    )
  }
}


export async function DELETE(request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    try {
        const team = await deleteTeam(id)
        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 })
        }
        return NextResponse.json( team )
    } catch (error) {
        console.error("Failed to delete team:", error)
        return NextResponse.json(
            { error: "Failed to fetch team" },
            { status: 500 }
        )
    }
}