// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
// import HomePage from "./pages/HomePage";
// import UserProfilePage from "./pages/UserProfilePage";
// import HotelPage from "./pages/HotelPage";
// import BookingHotel from "./pages/BookingHotel";
// import FlightBooking from "./pages/FlightBookingPage";
// import PromotionPage from "./pages/PromotionPage";
// import AirportTransfer from "./pages/AirportTransferPage";
// import DetailsHotel from "./pages/DetailHotelPage";
// import ForgotPassword from "./components/ForgotPassword";
// import TransactionHistory from "./pages/TransactionHistory";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/sign-in" />} />
//         <Route path="/sign-up" element={<SignUp />} />
//         <Route path="/sign-in" element={<SignIn />} />
//         <Route path="/reset-password/*" element={<ForgotPassword />} />
//         <Route path="/transaction-history" element={<TransactionHistory />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/user/account" element={<UserProfilePage />} />
//         <Route path="/hotel" element={<HotelPage />} />
//         <Route path="/hotel/payment" element={<BookingHotel />} />
//         <Route path="/flight" element={<FlightBooking />} />
//         <Route path="/promotion" element={<PromotionPage />} />
//         <Route path="/transfer" element={<AirportTransfer />} />
//         <Route path="/details-hotel/:id" element={<DetailsHotel />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";

import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import HotelPage from "./pages/HotelPage";
import BookingHotel from "./pages/BookingHotel";
import FlightBooking from "./pages/FlightBookingPage";
import PromotionPage from "./pages/PromotionPage";
import AirportTransfer from "./pages/AirportTransferPage";
import DetailsHotel from "./pages/DetailHotelPage";
import TransactionHistory from "./pages/TransactionHistory";

import Dashboard from "./components/admin/Dashboard";
import Login from "./components/admin/Login";
import RequireAuth from "./components/admin/RequireAuth";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect gốc đến trang sign-in */}
        <Route
          path="/"
          element={
            localStorage.getItem("accessToken") ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />

        {/* Route người dùng */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/reset-password/*" element={<ForgotPassword />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user/account" element={<UserProfilePage />} />
        <Route path="/hotel" element={<HotelPage />} />
        <Route path="/hotel/payment" element={<BookingHotel />} />
        <Route path="/flight" element={<FlightBooking />} />
        <Route path="/promotion" element={<PromotionPage />} />
        <Route path="/transfer" element={<AirportTransfer />} />
        <Route path="/details-hotel/:id" element={<DetailsHotel />} />

        {/* Route admin */}
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
}

export default App;
