import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    adresse: "",
    telephone: "",
  });

  const [errors, setErrors] = useState({});

  // Gestion des changements dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    

    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise";

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est requis";
    } else if (!/^\d{10}$/.test(formData.telephone.replace(/\s/g, ""))) {
      newErrors.telephone = "Le numéro de téléphone doit contenir 10 chiffres";
    }

    return newErrors;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log("Données du formulaire:", formData);
      // Ici tu ajouteras l'appel API plus tard
      alert("Inscription réussie ! (Front-end seulement pour le moment)");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl md:text-3xl font-bold text-gray-900">
          Créer votre compte Harmony
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 text-sm"
          >
            connectez-vous si vous avez déjà un compte
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3 sm:px-0">
        <div className="bg-white p-4 md:py-8 md:px-10 shadow sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom *
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prénom *
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.prenom ? "border-red-500" : "border-gray-300"
                  } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {errors.prenom && (
                  <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
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

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe *
              </label>
              <input
                id="password"
                name="password"
                type="password"
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

            {/* Confirmation mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Adresse */}
            <div>
              <label
                htmlFor="adresse"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse *
              </label>
              <textarea
                id="adresse"
                name="adresse"
                rows={3}
                value={formData.adresse}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.adresse ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                placeholder="Votre adresse complète"
              />
              {errors.adresse && (
                <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro de téléphone *
              </label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.telephone ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                placeholder="Ex: 0123456789"
              />
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
              )}
            </div>

            {/* Bouton d'inscription */}
            <div>
              <button
                type="submit"
                className="w-full h-10 md:h-12 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
