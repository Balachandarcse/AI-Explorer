import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import "../css/ai-tool.css";

const AITool = () => {
  const { toolId } = useParams();
  const [tool, setTool] = useState(null);

  useEffect(() => {
    async function fetchTool() {
      try {
        const res = await fetch(`http://localhost:4000/tool/${toolId}`);
        const data = await res.json();
        if (res.ok && data.isvalid) {
          setTool(data.data);
        } else {
          console.error("Tool not found");
        }
      } catch (error) {
        console.error("Error fetching tool:", error);
      }
    }
    fetchTool();
  }, [toolId]);

  // Extract YouTube embed link
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (!tool) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="tool-details-container">
        <h1>{tool.name}</h1>
        <p><strong>Category:</strong> {tool.category}</p>
        <p className="description">{tool.description}</p>

        {tool.youtubeUrl && (
          <div className="video-container">
            <iframe
              width="100%"
              height="400"
              src={getYouTubeEmbedUrl(tool.youtubeUrl)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Tutorial Video"
            ></iframe>
          </div>
        )}
        {tool.link && (
          <div className="visit-button-container">
            <a href={tool.link} target="_blank" rel="noopener noreferrer">
              <button className="visit-tool-btn">Visit AI Tool</button>
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default AITool;
