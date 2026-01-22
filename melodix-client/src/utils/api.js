// Configuration de l'API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Fonction utilitaire pour effectuer des requêtes API
 * @param {string} endpoint - L'endpoint de l'API (ex: '/api/auth/login')
 * @param {object} options - Les options de la requête fetch
 * @returns {Promise} - La réponse de l'API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem('token');
  
  // Configuration par défaut
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Fusionner les options
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

// Export de l'URL de base pour utilisation ailleurs si nécessaire
export { API_BASE_URL };
