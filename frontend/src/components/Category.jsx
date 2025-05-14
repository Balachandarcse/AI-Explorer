import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import "../css/category.css";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const handleExplore = (toolId, miniVersion) => {
    navigate(`/tools/${toolId}`, { state: { miniVersion } });
  };
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://ai-explorer.onrender.com/categories");
        const data = await res.json();
        if (res.ok) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const res = await fetch(`https://ai-explorer.onrender.com/toolsByCategory/${category}`);
      const data = await res.json();
      if (res.ok) setTools(data.tools);
    } catch (err) {
      console.error("Failed to fetch tools for category", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="category-page">
        <h1>Explore by Category</h1>
        <div className="category-list">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`category-btn ${cat === selectedCategory ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedCategory && <h2>Tools in "{selectedCategory}"</h2>}
        <div className="tools-container">
          {tools.map((tool) => (
            <div key={tool._id} className="tool-card">
              <img src={tool.logo} alt={tool.name} className="tool-image" />
              <h3>{tool.name}</h3>
              <p>{tool.description.length > 100 
                  ? `${tool.description.substring(0, 100)}...`
                  : tool.description}</p>
                  <button
        className="explore-btn" 
        onClick={() => handleExplore(tool._id, tool.link)}
      >
        Explore
      </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Category;
