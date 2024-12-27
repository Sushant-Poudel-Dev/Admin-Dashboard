// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { getBookings } from "../api";

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings().then((data) => setBookings(data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {bookings.length === 0 ? (
          <p>No bookings available</p>
        ) : (
          bookings.map((booking, index) => (
            <li key={index}>
              <strong>{booking.customerName}</strong> - {booking.venue} on{" "}
              {booking.date}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DashboardPage;
