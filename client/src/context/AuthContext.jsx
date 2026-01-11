import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in (on page refresh)
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data; // Return data so we can check role in the UI
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.message);
      throw error;
    }
  };

  // Register Function
  const register = async (name, email, password, role) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "http://localhost:5000/api/users/register",
        { name, email, password, role },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
    } catch (error) {
       console.error("Registration Failed:", error.response?.data?.message);
       throw error;
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;