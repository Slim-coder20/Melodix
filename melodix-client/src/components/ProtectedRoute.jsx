import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';


function ProtectedRoute({ children, requiredRole = null}){
  // 1) On récupère les informations de l'utilisateur //
  const { isAuthenticated, isLoading, user} = useAuth();
  
  // 2) Si le chargement est en cours on affiche un message de chargement //
  if (isLoading) return <div className='flex justify-center items-center h-screen'>Chargement en cours...</div>
  
  // 3) Si l'utilisateur n'est pas authentifié on le redirige vers la page de connexion //
  if (!isAuthenticated) return <Navigate to='/login' replace />
  
  // 4) Si l'utilisateur n'a pas le role requis on le redirige vers la page d'accueil //
  if (requiredRole && user?.role !== requiredRole) return <Navigate to='/' replace />
  
  // 5) Si l'utilisateur a le role requis on affiche le contenu protégé //
  return children;
}

export default ProtectedRoute;