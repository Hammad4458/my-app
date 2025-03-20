import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../common/axios-interceptor/index";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          setLoading(false);
          navigate("/login");
          return;
        }

        const endpoint = (userType==="user")? "users/me":"super-admin/me";
        const response = await api.get(endpoint);
        console.log("Tokennnn brought User",response.data);
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to authenticate user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
