import React, { useState } from "react";
import Input from "../common/input";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlices";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import "../../css/auth/Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!fullName || !email || !password) {
      dispatch(setError("Please fill all fields"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          name: fullName,
          email,
          password,
          avatar: base64Image || undefined,
        }
      );

      const data = res.data || {};

      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        })
      );

      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
    } catch (error) {
      dispatch(
        setError(
          error?.response?.data?.message ||
            "Signup failed. Please try again"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an Account</h3>
      <p className="signup-subtitle">
        Join us today by entering the details
      </p>

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="profile-image-container">
          {previewImage ? (
            <img src={previewImage} alt="avatar" className="profile-image" />
          ) : (
            <div className="profile-placeholder">
              <CiUser size={40} />
            </div>
          )}

          {/* ✅ THIS IS THE FIX */}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <label htmlFor="avatar-upload" className="image-upload-icon">
            📷
          </label>
        </div>

        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="forgot-link"
          onClick={() => dispatch(switchAuthMode("login"))}
        >
          Already have an account?
        </span>

        {error && <div className="signup-error">{error}</div>}

        <div className="signup-actions">
          <button
            className="signup-btn-submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
