import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css"; // Reusing your existing login CSS

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://ai-explorer.onrender.com/admin-login", {
        email,
        password,
      });

      if (response.data.isvalid) {
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        localStorage.setItem("adminToken", response.data.token);
        alert("Admin Login Successful!");
        navigator("/admin");
      } else {
        alert("Admin login failed!");
      }
    } catch (err) {
      alert("Invalid admin credentials!");
    }
  };

  return (
    <div className="login-page">
      <div className="login">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
          <Link to="/">Login as User</Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
