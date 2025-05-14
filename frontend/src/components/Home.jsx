import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import "../css/home.css";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [expandedDescription, setExpandedDescription] = useState(null);
  const [tools, setTools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 20;

  const handleViewMore = (id) => {
    setExpandedDescription(id);
  };

  const handleViewLess = () => {
    setExpandedDescription(null);
  };

  const handleExplore = (toolId, miniVersion) => {
    navigate(`/tools/${toolId}`, { state: { miniVersion } });
  };

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("https://ai-explorer.onrender.com/availableTools");
        const data = await res.json();
        if (res.ok && data.isvalid) {
          setTools(data.data);
        } else {
          console.error(data.message || "Failed to fetch tools");
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      }
    }
    fetchTools();
  }, []);

  // Pagination calculations
  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = tools.slice(indexOfFirstTool, indexOfLastTool);
  const totalPages = Math.ceil(tools.length / toolsPerPage);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1 className="intro">Welcome to AI Explorer</h1>
        <h2 className="sub-intro">Discover and interact with a variety of AI applications</h2>
        <div className="tools-container">
          {currentTools.map((tool) => (
            <div key={tool._id} className="tool-card">
              <img
                src={tool.logo}
                alt={tool.name}
                className="tool-image"
              />
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">
                {expandedDescription === tool._id
                  ? tool.description
                  : tool.description.length > 100
                    ? `${tool.description.substring(0, 100)}...`
                    : tool.description}

                {tool.description.length > 100 && (
                  <span
                    className="view-more"
                    onClick={() =>
                      expandedDescription === tool._id
                        ? handleViewLess()
                        : handleViewMore(tool._id)
                    }
                  >
                    {expandedDescription === tool._id ? " View Less" : " View More"}
                  </span>
                )}
              </p>
              <button
                className="explore-btn"
                onClick={() => handleExplore(tool._id, tool.link)}
              >
                Explore
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;








//   const hhh=async()=>{
  
// try {
//         const response = await fetch("http://localhost:4000/insert-all", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(ex), // Convert array to JSON string
//     });
//       } catch (error) {
//         console.error("Failed to insert tools:");
//       }

//   }
