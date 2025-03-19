import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../common/axios-interceptor/index";
import { useUser } from "../../components/context/index";
import { useNavigate } from "react-router-dom";
import { Button, Radio } from "antd";
import 'antd/dist/reset.css';
import { z } from "zod";
import { useState } from "react";
import "./login.css"; 

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Login = () => {
  const [userType, setUserType] = useState("user"); // Default to "user"
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting Data:", data); // Debugging: Check if data is logged
    try {
      // Choose endpoint based on user type selection
      const endpoint = userType === "superAdmin" ? "/super-admin/login" : "/users/login";
      
      console.log("Endpoint:", endpoint); // Debugging: Check if endpoint is correct
      
      const response = await api.post(endpoint, data);
  
      console.log("Response:", response); // Debugging: Check the response from the server
  
      if (response.data?.user) {
        console.log("User Data:", response.data.user); // Debugging: Check user data
        setUser(response.data.user);
        localStorage.setItem("userType", userType);
       
        console.log("Navigating to:", userType === "user" ? "/dashboard" : "/superAdmin/Dashboard"); // Debugging: Check navigation path
        navigate(userType === "user" ? "/dashboard" : "/superAdmin/Dashboard");
      } else {
        console.log("User not found or invalid credentials");
      }
    } catch (error) {
      console.error("Server Side Error", error); // Debugging: Check for any server-side errors
    }
  };

  const handleUserTypeChange = (e) => {
    console.log("User Type Changed:", e.target.value); // Debugging: Check if user type is changing
    setUserType(e.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form Submitted with:", data); // Debugging: Check if form data is logged
            onSubmit(data);
          })}
          className="login-form"
        >
          <div className="form-group role-selector">
            <label>Login as:</label>
            <Radio.Group onChange={handleUserTypeChange} value={userType}>
              <Radio value="user">User</Radio>
              <Radio value="superAdmin">Super Admin</Radio>
            </Radio.Group>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              className="input-field"
            />
            {errors.email && (
              <p className="error-text">{errors.email.message?.toString()}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password")}
              className="input-field"
            />
            {errors.password && (
              <p className="error-text">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};