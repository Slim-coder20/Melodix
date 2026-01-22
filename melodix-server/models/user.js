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
    minlength: 8,
    validate:{
      validator: function(value){
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: "Le mot de passe n'est pas valide",
    }
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