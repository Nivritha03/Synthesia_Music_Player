import React, { useEffect } from "react";
import "../../css/auth/Auth.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
  clearError,
  logout,
  setUser,
} from "../../redux/slices/authSlice";

import {
  closeAuthModal,
  openAuthModal,
} from "../../redux/slices/uiSlices";

import Signup from "./Signup";
import Login from "./Login";
import Modal from "../common/Modal";

const Auth = () => {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { authModalOpen, authMode } = useSelector((state) => state.ui);

  // 🔐 Restore auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(
          setUser({
            user: res.data.user,
            token,
          })
        );
      } catch (error) {
        console.error("Session restore failed", error);
        dispatch(logout());
        localStorage.removeItem("token");
      }
    };

    fetchMe();
  }, [dispatch]);

  return (
    <>
      <div className="auth-container" style={{ marginTop: "24px" }}>
        {!isAuthenticated ? (
          <>
            <button
              className="auth-btn signup"
              onClick={() => {
                dispatch(clearError());
                dispatch(openAuthModal("signup"));
              }}
            >
              Signup
            </button>

            <button
              className="auth-btn login"
              onClick={() => {
                dispatch(clearError());
                dispatch(openAuthModal("login"));
              }}
            >
              Login
            </button>
          </>
        ) : (
          <button
            className="auth-btn logout"
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem("token");
            }}
          >
            Logout
          </button>
        )}
      </div>

      {authModalOpen && (
        <Modal
          onClose={() => {
            dispatch(closeAuthModal());
            dispatch(clearError());
          }}
        >
          {authMode === "signup" && <Signup />}
          {(authMode === "login" || authMode === "forget") && <Login />}
        </Modal>
      )}
    </>
  );
};

export default Auth;
