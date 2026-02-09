import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({

  firstname : {
    type: String, 
    required: true,
  },
  lastname: {
    type: String, 
    required: true, 
  }, 
  email: {
    type: String, 
    required: true, 
  }, 
  phone: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true, 
  },
  date: {
    type: Date, 
    default: Date.now
  }

}); 

// Création et exportation du modèle
const Contact = mongoose.models.contact || mongoose.model("contact", contactSchema);

export default Contact; 