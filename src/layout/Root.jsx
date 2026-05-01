import { Header } from "../component/Header";
import { Outlet } from "react-router";
import { Footer } from "../component/Footer";
import AuthProvider from "../provider/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Root = () => {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </AuthProvider>
  );
};
