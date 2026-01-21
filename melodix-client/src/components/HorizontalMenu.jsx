import React from "react";
import { Link } from "react-router-dom";
export default function HorizontalMenu() {
  
  return (
    <div className=" w-full bg-blue-800 px-3 py-3 md:p-8 text-white font-normal mt-0">
      {/* Navigation menu about  */}
      <ul className=" flex flex-wrap md:flex-nowrap justify-center items-center gap-3 sm:gap-6 md:gap-10 overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
        <li>
          <Link
            to="/about"
            className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
          >
            QUI SOMMES NOUS ?
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
          >
            CONTACT
          </Link>
        </li>
        <li>
          <Link
            to="/equipe"
            className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
          >
            L'ÉQUIPE{" "}
          </Link>
        </li>
        <li>
          <Link
            to="/harmony-store"
            className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
          >
            HARMONY STORE
          </Link>
        </li>
        <li>
          <Link
            to="/logistique"
            className="text-base sm:text-lg md:text-2xl hover:font-bold transition duration-300 text-center"
          >
            LOGISTIQUE
          </Link>
        </li>
      </ul>
    </div>
  );
}
