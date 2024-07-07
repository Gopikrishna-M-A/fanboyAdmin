import dbConnect from './db';
import Team from './models/Team';

export async function getAllTeams() {
  await dbConnect();

  const teams = await Team.find({}).lean();

  return teams ? JSON.parse(JSON.stringify(teams)) : null;
}

export async function getTeamById(id) {
  await dbConnect();

  const team = await Team.findById(id).lean();

  return team ? JSON.parse(JSON.stringify(team)) : null;
}

export async function createTeam(teamData) {
  await dbConnect();

  const team = new Team(teamData);
  const result = await team.save();

  return result ? JSON.parse(JSON.stringify(result)) : null;
}

export async function updateTeam(id, updateData) {
  await dbConnect();

  const updatedTeam = await Team.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    lean: true,
  });

  return updatedTeam ? JSON.parse(JSON.stringify(updatedTeam)) : null;
}

export async function deleteTeam(id) {
  await dbConnect();

  const result = await Team.findByIdAndDelete(id);

  return result ? JSON.parse(JSON.stringify(result)) : null;
}
