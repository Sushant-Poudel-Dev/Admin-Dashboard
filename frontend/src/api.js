// src/api.js
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Backend API URL

// Fetch clients
export const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients", error);
    return [];
  }
};

// Fetch vendors
export const getVendors = async () => {
  try {
    const response = await axios.get(`${API_URL}/vendors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors", error);
    return [];
  }
};

// Fetch bookings
export const getBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings", error);
    return [];
  }
};

// Fetch services
export const getServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services", error);
    return [];
  }
};
