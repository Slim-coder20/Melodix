import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 

// Création d'un nouvel utilisateur //
export const register = async (req, res) => {
  try {
    // Récupération des données du formulaire d'inscription //
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      address,
      phone,
    } = req.body;

    // Validation des données //
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !address ||
      !phone
    ) {
      return res
        .status(400)
        .json({ errorMessage: 'Tous les champs sont requis' });
    }

    // Normalisation de l'email (minuscules, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Validation de l'email et vérification du format //
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ errorMessage: "L'email n'est pas valide" });
    }

    // Validation de la confirmation du mot de passe //
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({
          errorMessage: 'Les mots de passe ne correspondent pas',
        });
    }

    // Validation de la longueur du mot de passe //
    if (password.length < 8) {
      return res.status(400).json({
        errorMessage:
          'Le mot de passe doit contenir au moins 8 caractères',
      });
    }

    // Validation de la force du mot de passe (majuscule, minuscule, chiffre, caractère spécial)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        errorMessage:
          'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      });
    }

    // Vérification si l'email existe déjà //
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ errorMessage: "L'email existe déjà" });
    }

    // Hashage du mot de passe avec un salt rounds plus élevé pour plus de sécurité //
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur //
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      address: address.trim(),
      phone: phone.trim(),
    });

    // Enregistrement de l'utilisateur //
    await newUser.save();

    // Réponse//
    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });

    // Envoi d'un email de confirmation d'inscription à implémenter plus tard //
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);

    // Gestion des erreurs Mongoose (ex: duplicate key)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ errorMessage: "L'email existe déjà" });
    }

    return res
      .status(500)
      .json({ errorMessage: "Erreur lors de l'inscription" });
  }
};

// Connexion d'un utilisateur //
export const login = async (req, res) => {
  try {
    // Récupération des données du formulaire de connexion //
    const { email, password } = req.body;

    // Validation des données //
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "L'email et le mot de passe sont requis",
      });
    }

    // Normalisation de l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Vérification si l'email existe //
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      // Message générique pour éviter l'énumération d'emails
      return res.status(401).json({
        errorMessage: 'Email ou mot de passe incorrect',
      });
    }

    // Vérification du mot de passe //
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      // Message générique pour éviter l'énumération d'emails
      return res.status(401).json({
        errorMessage: 'Email ou mot de passe incorrect',
      });
    }

    // Si tout est ok, création d'un token JWT //
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Réponse JSON avec le token et les informations utilisateur //
    return res.status(200).json({
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res
      .status(500)
      .json({ errorMessage: 'Erreur lors de la connexion' });
  }
};

// Réinitialisation du mot de passe //
export const forgotPassword = async (req, res) => {
  try {
    // Récupération de l'email de l'utilisateur //
    const { email } = req.body;

    // Validation de l'email //
    if (!email) {
      return res
        .status(400)
        .json({ errorMessage: "L'email est requis" });
    }

    // Normalisation de l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Validation du format email
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ errorMessage: "L'email n'est pas valide" });
    }

    // Vérification si l'email existe //
    const existingUser = await User.findOne({ email: normalizedEmail });

    // IMPORTANT : Toujours retourner le même message pour éviter l'énumération d'emails
    // Même si l'utilisateur n'existe pas, on retourne un message de succès
    if (existingUser) {
      // Génération d'un token de réinitialisation sécurisé
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Expire dans 1 heure

      // Sauvegarde du token dans la base de données
      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = resetTokenExpires;
      await existingUser.save();

      // Envoi d'un email de réinitialisation du mot de passe à implémenter plus tard
      // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      // await sendResetPasswordEmail(existingUser.email, resetUrl);
    }

    // Toujours retourner le même message pour éviter l'énumération d'emails
    return res.status(200).json({
      message:
        "Si l'email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error) {
    console.error(
      'Erreur lors de la réinitialisation du mot de passe:',
      error
    );
    return res.status(500).json({
      errorMessage:
        'Erreur lors de la réinitialisation du mot de passe',
    });
  }
};