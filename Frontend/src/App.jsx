import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthModal from "./components/auth/AuthModal";

import Homepage from "./pages/Homepage";
import Login from "./components/auth/login";
// import Register from "./pages/Register";

import "./App.css";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setuser } from "./Redux/Slices/authslice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.user) {
          dispatch(setuser({ user: response.data.user, token }));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthModal />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
