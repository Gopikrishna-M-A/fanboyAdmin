import mongoose from 'mongoose'


const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});


export default mongoose.models.Team || mongoose.model("Team", teamSchema)