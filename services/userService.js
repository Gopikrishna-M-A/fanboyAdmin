import dbConnect from './db';
import User from './models/User';

export async function getUser(userId) {
  await dbConnect();

  const user = await User.findById(userId).lean();

  return user ? JSON.parse(JSON.stringify(user)) : null;
}

export async function updateUser(userId, updates) {
  await dbConnect();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true, lean: true }
  );

  return updatedUser ? JSON.parse(JSON.stringify(updatedUser)) : null;
}

export async function getUsers() {
  await dbConnect();

  const users = await User.find().lean();

  return users.map((user) => JSON.parse(JSON.stringify(user)));
}

