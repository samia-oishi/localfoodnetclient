import React from "react";
import { Header } from "../component/Header";
import { Outlet } from "react-router";
import { Footer } from "../component/Footer";

export const Root = () => {
  return (
    <>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};
