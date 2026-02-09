import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { resetPassword, isLoading } = useAuth();
  const { showToast } = useToast();

  const onSubmit = async (data) => {
    if (!token) {
      showToast("Lien invalide. Veuillez refaire une demande de réinitialisation.", {
        type: "error",
      });
      return;
    }

    const result = await resetPassword(
      token,
      data.password,
      data.confirmPassword
    );

    if (result.success) {
      showToast(result.message || "Mot de passe réinitialisé", {
        type: "success",
      });
      reset();
    } else {
      showToast(result.message || "Erreur lors de la réinitialisation", {
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl md:text-4xl font-bold text-gray-900">
          Réinitialisation du mot de passe
        </h2>
        <p className="mt-2 text-center text-base md:text-lg text-gray-600 px-3">
          Entrez votre nouveau mot de passe ci-dessous.
        </p>
      </div>
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3 sm:px-0">
        <div className="bg-white p-4 md:py-8 md:px-10 shadow sm:rounded-lg">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre nouveau mot de passe"
                {...register("password", { required: "Le mot de passe est requis" })}
                className={`mt-1 block w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre nouveau mot de passe"
                {...register("confirmPassword", {
                  required: "La confirmation du mot de passe est requise",
                  validate: (value) =>
                    value === watch("password") || "Les mots de passe ne correspondent pas",
                })}
                className={`mt-1 block w-full border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full h-10 md:h-12 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
