import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import "../css/home.css";
import { useState, useEffect } from "react";
import axios from 'axios'

const Home = () => {
  const navigate = useNavigate();
  const [expandedDescription, setExpandedDescription] = useState(null);

  const handleViewMore = (id) => {
    setExpandedDescription(id);
  };

  const handleViewLess = () => {
    setExpandedDescription(null);
  };
  const handleExplore = (toolId, miniVersion) => {
    navigate(`/tools/${toolId}`, { state: { miniVersion } });
  };
  const [tools, setTools] = useState([]);

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("http://localhost:4000/availableTools");
        const data = await res.json();
        if (res.ok && data.isvalid) {
          setTools(data.data);
        } else {
          setError(data.message || "Failed to fetch tools");
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      }
    }
    fetchTools();
  }, []);
  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1 className="intro">Welcome to AI Explorer</h1>
        <h2 className="sub-intro">Discover and interact with a variety of AI applications</h2>
        <div className="tools-container">
          {tools.map((tool) => (
            <div key={tool._id} className="tool-card">
              <img
                src={tool.logo}
                alt={tool.name}
                className="tool-image"
              />
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{expandedDescription === tool._id
                ? tool.description
                : tool.description.length > 100
                  ? `${tool.description.substring(0, 100)}...`
                  : tool.description}

                {/* View More / View Less toggle */}
                {tool.description.length > 100 && (
                  <span
                    className="view-more"
                    onClick={() =>
                      expandedDescription === tool._id
                        ? handleViewLess()
                        : handleViewMore(tool._id)
                    }
                  >
                    {expandedDescription === tool._id ? "View Less" : "View More"}
                  </span>
                )}</p>
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

export default Home;
