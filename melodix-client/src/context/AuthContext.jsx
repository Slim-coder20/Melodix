import { createContext, useContext, useState, useEffect } from "react"; 


// Création du context de l'authentification // 
const AuthContext = createContext(); 

// Création du provider de l'authentification // 
export const AuthProvider = {{children}} => {
  // décalaration des states 
  const [ user, setUser ] = useState(null); 
  const [isLoading, setIsLoading ] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour créer un nouveau utilisateur // 
  const register = async (userData) => {
    try {
      
      
    } catch (error) {
      
    }
  }





}