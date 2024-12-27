// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import VendorsPage from "./pages/VendorsPage";
import BookingsPage from "./pages/BookingsPage";
import ServicesPage from "./pages/ServicesPage";
import Sidebar from "./components/Sidebar/Sidebar"; // Import Sidebar
import "./App.css";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route
              path='/dashboard'
              element={<DashboardPage />}
            />
            <Route
              path='/clients'
              element={<ClientsPage />}
            />
            <Route
              path='/vendors'
              element={<VendorsPage />}
            />
            <Route
              path='/bookings'
              element={<BookingsPage />}
            />
            <Route
              path='/services'
              element={<ServicesPage />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
