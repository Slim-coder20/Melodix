/**
 * template pour le formulaire de contact de l'application
 */

export const getUserEmail = (firstname, lastname, content) => {
  return `
    Bonjour ${firstname} ${lastname},<br><br>
    Nous avons bien reçu votre message. Nous vous répondrons dans les meilleurs délais.<br><br>
    Votre message : "${content}"<br><br>
    Cordialement,<br>
    L'équipe Melodix
  `;
};
