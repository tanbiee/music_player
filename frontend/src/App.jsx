import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, logout } from "./Redux/Slices/authslice";
import { clearError } from "./Redux/Slices/authslice";
import Modal from "./components/Common/Modal";
import "./App.css";
import { setuser } from "./Redux/Slices/authslice";
import { useEffect } from "react";

function App() {

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken || user) return;

    const fetchuser = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
          }
        );

        dispatch(setuser({ user: response.data, token: storedToken }));
      } catch (error) {
        console.log("getMe Failed", error);
        dispatch(logout());
        dispatch(
          setError(
            error?.response?.data?.message || "Session expired. please login again",
          ),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchuser();
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Modal />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
