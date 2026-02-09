/**
 * Ce fichier contient le template de l'email envoyé pour la réinitialisation du mot de passe utilisateur
 */

export const getResetPasswordTemplate = (email, resetToken, frontendUrl, firstName) => {
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe - Melodix",
    html: `
      Bonjour ${firstName || ''},<br><br>
      Vous avez demandé à réinitialiser votre mot de passe. Pour le faire, veuillez cliquer sur le lien suivant : <a href="${resetLink}">Réinitialiser mon mot de passe</a><br><br>
      Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet email.<br><br>
      Cordialement,<br>
      L'équipe Melodix
    `,
  };
  return mailOptions;
}; 