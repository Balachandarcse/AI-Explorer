import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");
  const handleExplore = (toolId, miniVersion) => {
    navigate(`/tools/${toolId}`, { state: { miniVersion } });
  };
  const [expandedDescription, setExpandedDescription] = useState(null);

  const handleViewMore = (id) => {
      setExpandedDescription(id);
  };

  const handleViewLess = () => {
      setExpandedDescription(null);
  };
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`https://ai-explorer.onrender.com/tools/search?query=${searchQuery}`);
        if (response.data.isvalid && response.data.data.length > 0) {
          setSearchResults(response.data.data);
          setNoResults(false);
        } else {
          setSearchResults([]);
          setNoResults(true);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setNoResults(true);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="search-results-page">
      <Navbar/>
      <h2>Search Results for "{searchQuery}"</h2>
      {noResults ? (
        <p>No tools found</p>
      ) : (
        <div className="tools-container">
          {searchResults.map((tool) => (
            <div key={tool._id} className="tool-card">
              <img src={tool.logo} alt={tool.name} className="tool-image" />
              <h3>{tool.name}</h3>
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
      )}
    </div>
  );
};

export default SearchResults;
