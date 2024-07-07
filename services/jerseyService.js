import dbConnect from "./db"
import Jersey from "./models/Jersey"
import Team from "./models/Team"

export async function getJerseys(limit = 10, page = 1) {
  await dbConnect()

  const jerseys = await Jersey.find({})
    .populate({
      path: "team",
      model: Team,
    })
    .lean()
  return JSON.parse(JSON.stringify(jerseys))
}

export async function getJerseyById(id) {
  await dbConnect()

  const jersey = await Jersey.findById(id)
    .populate({
      path: "team",
      model: Team,
    })
    .lean()

  

  return jersey ? JSON.parse(JSON.stringify(jersey)) : null
}

export async function getJerseysByTeam(teamId) {
  await dbConnect()

  const jerseys = await Jersey.find({ team: teamId })
    .populate({
      path: "team",
      model: Team,
    })
    .lean()

  return JSON.parse(JSON.stringify(jerseys))
}

export async function createJersey(jerseyData) {
  await dbConnect()

  const jersey = new Jersey(jerseyData)
  const result = await jersey.save()

  return JSON.parse(JSON.stringify(result))
}

export async function updateJersey(id, updateData) {
  await dbConnect()

  const updatedJersey = await Jersey.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    lean: true,
  })

  return updatedJersey ? JSON.parse(JSON.stringify(updatedJersey)) : null
}

export async function deleteJersey(id) {
  await dbConnect()

  const deletedJersey = await Jersey.findByIdAndDelete(id)

  return deletedJersey ? JSON.parse(JSON.stringify(deletedJersey)) : null
}
