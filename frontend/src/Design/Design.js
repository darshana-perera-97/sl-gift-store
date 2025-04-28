import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLogin from "./Pages/SuperAdminLogin";
import StoreLogin from "./Pages/StoreLogin";

export default function Design() {
  return (
    <div>
      {" "}
      <Routes>
        {/* Default to /login */}
        <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />
        <Route path="/" element={<StoreLogin />} />
      </Routes>
    </div>
  );
}
