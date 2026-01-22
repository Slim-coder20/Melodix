import { useForm } from 'react-hook-form'; 
import { Link } from "react-router-dom";


export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    // Code pour envoyer les données à l'API backend //
    console.log(data);
    reset();
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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
