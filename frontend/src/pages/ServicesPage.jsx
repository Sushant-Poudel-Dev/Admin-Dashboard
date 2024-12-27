// src/pages/ServicesPage.jsx
import React, { useEffect, useState } from "react";
import { getServices } from "../api";

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then((data) => setServices(data));
  }, []);

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services.length === 0 ? (
          <p>No services available</p>
        ) : (
          services.map((service, index) => (
            <li key={index}>
              <strong>{service.name}</strong> - {service.description} -{" "}
              {service.price}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ServicesPage;
