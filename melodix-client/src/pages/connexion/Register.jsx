import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  async function onSubmit(data) {
    // Code pour envoyer les données à l'API backend //
    console.log(data);
    reset();
  }

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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("nom", { required: "Le nom est requis" })}
                  className={`mt-1 block w-full border ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nom.message}
                  </p>
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
                  {...register("prenom", { required: "Le prénom est requis" })}
                  className={`mt-1 block w-full border ${
                    errors.prenom ? "border-red-500" : "border-gray-300"
                  } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
                {errors.prenom && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.prenom.message}
                  </p>
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
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
                {...register("confirmPassword", {
                  required: "La confirmation du mot de passe est requise",
                  validate: {
                    matchPassword: (value) =>
                      value === watch("password") ||
                      "Les mots de passe ne correspondent pas",
                  },
                })}
                className={`mt-1 block w-full border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
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
                {...register("adresse", {
                  required: "L'adresse est requise",
                })}
                className={`mt-1 block w-full border ${
                  errors.adresse ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                placeholder="Votre adresse complète"
              />
              {errors.adresse && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.adresse.message}
                </p>
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
                {...register("telephone", {
                  required: "Le numéro de téléphone est requis",
                })}
                className={`mt-1 block w-full border ${
                  errors.telephone ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                placeholder="Ex: 0123456789"
              />
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.telephone.message}
                </p>
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
