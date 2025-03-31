import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email: email,
        password: password,
      });
      console.log(response.data);
      if (response.data.isvalid) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        alert("Login Successful!");
        navigator('/home')
      }
      else {
        alert("Login failed!")
      }


    } catch (err) {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="login-page">
    <div className="login">
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
        <Link to="/signup">Don't have an account?</Link>
      </form>
    </div>
    </div>
  );
};

export default Login
