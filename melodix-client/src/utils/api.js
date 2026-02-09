/**
 * Ce fichier contient la configuration de l'API backend 
 * et la fonction utilitaire apiRequest pour effectuer des requêtes API
 * centralisées dans un seul fichier pour faciliter la gestion des requêtes API
 */

// URL de base de l'API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fonction utilitaire pour effectuer des requêtes API
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Récupérer le token JWT depuis localStorage
  const token = localStorage.getItem('token');
  
  // Configuration par défaut des options de la requête fetch
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Fusionner les options de la requête avec les options par défaut
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errorMessage || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Export de l'URL de base pour utilisation ailleurs
export { API_BASE_URL };
