import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    

    
    if (result.success) {
      showToast("Connexion réussie", { type: "success" });
      reset();
      // Rediriger vers la page d'accueil ou la page précédente
      navigate("/");
    } else {
      showToast(result.message || "Erreur de connexion", { type: "error" });
    }
  };
  


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl md:text-3xl font-bold text-gray-900">
          Connectez-vous
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 text-sm"
          >
            créer un compte
          </Link>
        </p>
      </div>
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3 sm:px-0">
        <div className="bg-white p-4 md:py-8 md:px-10 shadow sm:rounded-lg">
          <form className=" space-y-6 " onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
                {...register("email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "L'email n'est pas valide",
                  },
                })}
                className={`mt-1 block w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                {...register("password", {
                  required: "Le mot de passe est requis",
                  minlength: {
                    value: 8,
                    message: "Le mot de passe doit contenir au moins 8 caractères",
                  },
                })}
                className={`mt-1 block w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 md:h-12 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connexion..." : "Connexion"}
              </button>
            </div>
            {/* Checkbox + Lien */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center">
                {/* Checkbox "Se souvenir de moi" */}
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-900"
                >
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                {/* Lien "Mot de passe oublié" */}
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
