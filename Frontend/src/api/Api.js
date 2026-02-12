import axios from "axios";

// Generate or retrieve a user ID for this session
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

const API = axios.create({
  baseURL: "https://suii-3qod.onrender.com/api",
  headers: {
    "userid": getUserId()
  }
});

export default API;