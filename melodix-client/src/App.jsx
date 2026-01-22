import { Routes, Route } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Team from "@/pages/Team";
import HarmonyStore from "@/pages/HarmonyStore";
import Register from "@/pages/connexion/Register";
import Login from "@/pages/connexion/Login";
import ForgotPassword from "@/pages/connexion/ForgotPassword";
import Order from "@/pages/Order";
import Guitare from "@/pages/articles/Guitare";
import Product from "@/pages/Product";
import Basse from "@/pages/articles/Basse";
import Effet from "@/pages/articles/Effet";
import Batterie from "@/pages/articles/Batterie"
import PianoClavier from "@/pages/articles/PianoClavier";
import HomeStudio from "@/pages/articles/HomeStudio";
import Wishlist from "@/pages/Wishlist";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function App() {
  return (
    <Routes>
      {/* Routes avec layout (Header + Nav + footer) */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/order" element={
          <ProtectedRoute requiredRole="user">

            <Order />
          </ProtectedRoute>
          
          } 
          />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/equipe" element={<Team />} />
        <Route path="/harmony-store" element={<HarmonyStore />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/guitare" element={<Guitare />} />
        <Route path="/basse" element={<Basse />} />
        <Route path="/effet" element={<Effet />} />
        <Route path="/batterie" element={<Batterie />} />
        <Route path="/clavier-piano" element={<PianoClavier />} />
        <Route path="/home-studio" element={<HomeStudio />} />

        {/* Auth sous le même layout pour garder Header/Nav/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Optionnel: 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}