import mongoose from 'mongoose'; 

// Schema pour la collection users // 
const userSchema = new mongoose.Schema({
  firstName: {
    type: String, 
    required: true,
  },
  lastName: {
    type: String, 
    required: true, 
  },
  email: {
    type: String, 
    required: true,
    unique: true,
    validate:{
      validator: function(value){
        return /\S+@\S+\.\S+/.test(value);
      },
      message: "L'email n'est pas valide",
    }
  }, 
  password: {
    type: String,
    required: true,
    // La validation du format est faite dans le controller avant le hashage
    // Ici on stocke le hash qui ne correspond pas au pattern du mot de passe en clair
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  address:{
    type: String, 
    required: true,
  },
  phone:{
    type: String,
    required:true,
  },
  role: {
    type: String, 
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  }


}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;