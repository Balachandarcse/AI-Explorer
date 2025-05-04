import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import axios from "axios"; // Ensure you have axios installed

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Redirect to search results page
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">MyApp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/category">Category</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {user ? (
          <div className="user-menu">
            <div className="avatar" onClick={() => setDropdown(!dropdown)}>
              {user.firstname.charAt(0).toUpperCase()}
            </div>
            {dropdown && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
