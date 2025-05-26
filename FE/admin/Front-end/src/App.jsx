import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/admin/Login";
import RequireAuth from "./components/admin/RequireAuth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("accessToken") ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
