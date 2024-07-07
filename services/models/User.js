import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  emailVerified: Date,
  address:{
    street: String,
    city: String,
    state: String,
    zipcode: String,
    phone:String
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);