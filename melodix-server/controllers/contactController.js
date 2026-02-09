import transporter from "../config/email.js";
import Contact from "../models/contact.js"; 
import { getUserEmail } from "../template/index.js";


// Contact User // 
export const contactUser = async (req, res ) => {
  try {

      const { firstname, lastname, email, content } = req.body;
      const messageContent = content ?? req.body.message; 
      
      if(!firstname || !lastname || !email || !messageContent){
        return res.status(400).json({message: "Tous les champs sont requis"}); 
      }
    // Vérification du format de l'email 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          message: "Invalid email format",
        });
      }
    // Création d'un nouveau contact dans le model Contact // 
      const newContact = new Contact({
        firstname: firstname.trim(), 
        lastname: lastname.trim(),
        email: email.trim(),
        content: messageContent.trim(),
      }); 
      await newContact.save(); 
      // Envoi de l'email de confirmation de reception du message // 
      const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
      // Nom d'affichage de l'expéditeur // 
      const displayName = "Melodix";
      // Envoi de l'email de confirmation de reception du message // 
    // Confirmation de reception de l'email  (HTML + text fallback)
    await transporter.sendMail({
      from: `"${displayName}" <${senderEmail}>`,
      to: email.trim(),
      subject: "✓ Votre message a été bien reçu - Melodix",
      text: `Bonjour ${firstname} ${lastname}, Merci de nous avoir contacté `,
      html: getUserEmail(firstname.trim(), lastname.trim(), messageContent.trim()),
    });

    return res.status(200).json({message: "Message envoyé avec succès"});
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return res.status(500).json({message: "Erreur lors de l'envoi de l'email"});
    
  }
};