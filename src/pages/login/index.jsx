import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../common/axios-interceptor/index";
import { useUser } from "../../components/context/index";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { z } from "zod";
import "./login.css"; 

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Login = () => {
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
    console.log("Submitting Data:", data);
    try {
      const response = await api.post("/users/login", data);
  
      if (response.data?.user) {
        console.log(response.data.user);
        setUser(response.data.user);
       
        navigate("/dashboard");
      } else {
        console.log("User not found or invalid credentials");
      }
    } catch (error) {
      console.error("Server Side Error", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form Submitted with:", data); 
            onSubmit(data);
          })}
          className="login-form"
        >
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

          <Button type="submit" className="login-button">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
