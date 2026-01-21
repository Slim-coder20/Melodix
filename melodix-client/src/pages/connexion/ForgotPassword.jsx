import { useState } from "react";
import { Link } from "react-router-dom";


export default function ForgotPassword() {
  // State //

  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  // fonction //

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation formulaire //

  const validateForm = () => {
    const newErrors = {};

    // Vérifier que l'email est bien valide //
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    return newErrors;
  };

  // // Soumission du formulaire de rénitialisation du mot de passe  //
  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log("Données du formulaire:", formData);
      // Ici tu ajouteras l'appel API plus tard
      alert("envoie réussi ! (Front-end seulement pour le moment)");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl md:text-4xl font-bold text-gray-900">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-base md:text-lg text-gray-600 px-3">
          Si vous avez oublié votre mot de passe, entrez votre adresse
          électronique ci-dessous et nous vous enverrons un courrier
          électronique vous permettant de créer un nouveau mot de passe.
        </p>
      </div>
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3 sm:px-0">
        <div className="bg-white p-4 md:py-8 md:px-10 shadow sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-700"
              >
                Entrez votre email{" "}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre email"
                onChange={handleChange}
                value={formData.email}
                className={`mt-1 block w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full h-10 md:h-12 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
              >
                Nouveau mot de passe
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Retour à la{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm">
              connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
