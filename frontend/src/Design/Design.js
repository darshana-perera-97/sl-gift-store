import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLogin from "./Pages/SuperAdminLogin";

export default function Design() {
  return (
    <div>
      {" "}
      <Routes>
        {/* Default to /login */}
        <Route path="/" element={<SuperAdminLogin />} />
      </Routes>
    </div>
  );
}
