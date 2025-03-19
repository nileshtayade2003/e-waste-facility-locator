import { createContext, useState, useEffect } from "react";
import axios from "axios";



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  let token = null

  useEffect(() => {
    token = localStorage.getItem("userToken");
    if (token) {
      // Fetch user details from backend
      axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setUser(response.data.user); // Store user info in context
      })
      .catch(() => {
        localStorage.removeItem("userToken"); // Remove invalid token
        setUser(null);
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userToken"); // Clear token
    setUser(null); // Clear context
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, token }}>
      {children}
    </UserContext.Provider>
  );
};
