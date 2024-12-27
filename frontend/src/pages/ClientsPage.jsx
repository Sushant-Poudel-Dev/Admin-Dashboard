// src/pages/ClientsPage.jsx
import React, { useEffect, useState } from "react";
import { getClients } from "../api";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClients().then((data) => setClients(data));
  }, []);

  return (
    <div>
      <h1>Clients</h1>
      <ul>
        {clients.length === 0 ? (
          <p>No clients available</p>
        ) : (
          clients.map((client, index) => (
            <li key={index}>
              <strong>{client.name}</strong> - {client.email}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ClientsPage;
