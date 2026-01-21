import Header from "@/components/Header";
import FooterFixed from "@/components/FooterFixed";
import Nav from "@/components/Nav";
import CartProvider from "@/context/CartContext";
import { Outlet } from "react-router-dom";
import { ToastProvider, Toasts } from "@/context/ToastContext";

export default function RootLayout() {
  return (
      <ToastProvider>
        <CartProvider>
          <Header />
          <Nav />
          <Outlet/>
          <FooterFixed />
        </CartProvider>
        <Toasts />
      </ToastProvider>
      
  );
}
