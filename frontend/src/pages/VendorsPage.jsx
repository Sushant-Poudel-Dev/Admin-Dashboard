// src/pages/VendorsPage.jsx
import React, { useEffect, useState } from "react";
import { getVendors } from "../api";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors().then((data) => setVendors(data));
  }, []);

  return (
    <div>
      <h1>Vendors</h1>
      <ul>
        {vendors.length === 0 ? (
          <p>No vendors available</p>
        ) : (
          vendors.map((vendor, index) => (
            <li key={index}>
              <strong>{vendor.name}</strong> - {vendor.category}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default VendorsPage;
