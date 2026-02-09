import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";

// Création du context de l'authentification
const AuthContext = createContext(null);

// Clés de stockage localStorage
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Création du provider de l'authentification
export const AuthProvider = ({ children }) => {
// Déclaration des states
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
        // Nettoyer le localStorage en cas d'erreur
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Fonction pour créer un nouveau utilisateur
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mapper les noms de champs du formulaire vers ceux attendus par l'API
      const requestData = {
        firstName: userData.prenom,
        lastName: userData.nom,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        address: userData.adresse,
        phone: userData.telephone,
      };

      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      // L'inscription ne connecte pas automatiquement l'utilisateur
      // L'utilisateur devra se connecter après l'inscription
      return {
        success: true,
        message: response.message || "Inscription réussie",
        user: response.user,
      };
    } catch (error) {
      const errorMessage =
        error.message || "Erreur lors de l'inscription";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour connecter un utilisateur
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Sauvegarder le token et l'utilisateur
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Mettre à jour l'état
      setUser(response.user);
      setIsAuthenticated(true);

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      const errorMessage =
        error.message || "Email ou mot de passe incorrect";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour déconnecter un utilisateur
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Fonction pour définir un nouveau mot de passe (après clic sur le lien email)
  const resetPassword = async (token, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      const errorMessage =
        error.message || "Erreur lors de la réinitialisation du mot de passe";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour demander la réinitialisation du mot de passe (envoi email)
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      const errorMessage =
        error.message || "Erreur lors de la réinitialisation";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Valeur exposée aux composants
  const value = {
    user,
    isLoading,
    isAuthenticated,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    setError, // Permet de réinitialiser l'erreur depuis les composants
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook de confort pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};