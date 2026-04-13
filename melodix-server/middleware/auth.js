import jwt from "jsonwebtoken";

// Ce middleware va vérifié que l'utilisateur est bien authentifié //
export const authenticateToken = (req, res, next) => {
  // 1 - Récupération du token dans le header Authorization (format: Bearer TOKEN)
  const authHeader = req.header["authorization"];

  // 2 - extraire le token
  const token = authHeader && authHeader.split("")[1];
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Token d'authentification manquant" });
  }
  try {
    // Vérfier le token avec la clé secrète
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // On ajoute les infos de l'utilisateur à l'objet req pour les utilisateurs plus tard
    req.user = verified;
    // On passe a la fonction suivante (le controller)
    next();
  } catch (error) {
    // Si le toekn est invalide ou expiré
    res.status(403).json({ message: "Jeton invalide ou expiré" });
  }
};
