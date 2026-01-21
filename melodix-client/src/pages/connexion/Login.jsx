import { useState } from "react";
import { Link } from "react-router-dom";




export default function Login() {
  // State //
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  // Fonction //
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  // Validaion du formulaire //
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    return newErrors;
  };

  // Soumission du formulaire de connexion //
  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log("Données du formulaire:", formData);
      // Ici tu ajouteras l'appel API plus tard
      alert("connexion réussie ! (Front-end seulement pour le moment)");
    } else {
      setErrors(newErrors);
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
          <form className=" space-y-6 " onSubmit={handleSubmit}>
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
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full h-10 md:h-12 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
              >
                Connexion
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
                  checked={formData.rememberMe}
                  onChange={handleChange}
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
