import React from "react";
import { Route } from "react-router-dom";
import Search from "../components/Serach/Search";

const LoginRoutes = (
  <>
    <Route path="/search" element={<Search />} />
  </>
);

export default LoginRoutes;
