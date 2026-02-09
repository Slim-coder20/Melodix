/**
 * Ce fichier centralise la gestion des envoie de mails dans toute l'application 
 * Reset Password 
 * Confirmation d'inscription 
 * confirmation de commande avec envoie de numéro de commande 
 */

import nodemailer from "nodemailer"; 
import dotenv from "dotenv"; 

dotenv.config(); 

// Création du transporter email 
// Configuration flexible pour dévellopement et prodction 

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER, // Email de l'expéditeur
    pass: process.env.SMTP_PASSWORD, // Mot de passe d'application ou mot de passe SMTP
  },
});

export default transporter; 