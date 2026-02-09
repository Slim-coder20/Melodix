import { useState } from "react";
import { useForm } from "react-hook-form";    
import HorizontalMenu from "../components/HorizontalMenu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { apiRequest } from "@/utils/api";

export default function Contact() {
  // les States // 
  const navigate = useNavigate(); 
  const { showToast } = useToast(); 
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone:"",
      content: "",
    }
  });
  // Fonction pour envoyer le formulaire de contact en utilisant l'API backend avec la fonction apiRequest qui centralise les requêtes API//
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      showToast(response.message || "Message envoyé avec succès", { type: "success" });
      reset();
      navigate("/");
    } catch (error) {
      showToast(error.message || "Erreur lors de l'envoi du message", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Menu de navigation  */}
      <HorizontalMenu />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl md:text-5xl font-bold text-blue-900">
          CONTACTEZ-NOUS
        </h2>
        <a
          href="tel:0132456874"
          className="bg-blue-500 text-white flex items-center justify-center w-max mx-auto px-3 py-2 md:px-4 md:py-3 text-sm md:text-2xl font-semibold md:font-bold mt-3 rounded-md md:rounded-2xl shadow-sm active:scale-[.99]"
        >
          01 32 45 68 74
        </a>
      </div>

      {/* Section pour les horaires */}
      <div className="mt-8 md:mt-10 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 text-base md:text-lg font-medium">
          <div>
            <p className="font-bold">LUNDI - VENDREDI</p>
            <p>9h00 - 18h00</p>
          </div>
          {/* Trait vertical (affiché seulement en md+) */}
          <div className="hidden md:block border-l border-gray-400 h-10"></div>
          <div>
            <p className="font-bold">SAMEDI</p>
            <p>10h00 - 18h00</p>
          </div>
        </div>
      </div>

      {/* Section pour les conseils produits */}
      <div className="mt-10 text-center px-3">
        <h3 className="font-bold text-xl md:text-3xl">
          COMMANDE PAR TÉLÉPHONE, CONSEILS PRODUITS
        </h3>
        <p className="mt-2 text-gray-700 text-center text-base md:text-[20px]">
         contactez nos conseillers par email à l'adresse suivante  
          sur{" "}
          <a
            href="mailto:conseil@melodix.com"
            className="text-blue-500 underline"
          >
            conseil@melodix.com
          </a>
        </p>
      </div>

      {/* Formulaire de contact */}
      <div className="mt-8 md:mt-10 sm:mx-auto sm:w-full sm:max-w-md px-3 sm:px-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-5"
        >
          <div className="mb-4">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
            Nom
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              {...register("lastname", { required: "Le nom est requis"})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
            Prénom
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              {...register("firstname", { required: "Le prénom est requis"})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              {...register("email",{required:"L'email est requis"})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Téléphone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              {...register("phone", {required:"Le numéro de téléphone est requis"})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              name="content"
              id="content"
              {...register("content", {required: "Le message est requis"})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 md:h-12 bg-blue-500 text-white text-sm md:text-base rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Envoi en cours…" : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}
