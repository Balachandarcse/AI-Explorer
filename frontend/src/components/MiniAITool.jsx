import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import "../css/mini-ai-tool.css";

const MiniAITool = () => {
  const { miniToolId } = useParams();
  const navigate = useNavigate();

  const toolContent = {
    "image-generator-mini": (
      <p>🔹 Enter a description and generate an AI-powered image. (Demo mode)</p>
    ),
    "chatbot-mini": (
      <iframe
        src="https://chat.openai.com/"
        title="ChatGPT"
        className="ai-embed"
      ></iframe>
    ),
    "code-assistant-mini": (
      <p>🖥️ Type your code snippet, and AI will suggest improvements. (Demo mode)</p>
    ),
    "speech-to-text-mini": (
      <p>🎙️ Speak into your microphone, and AI will transcribe it here. (Demo mode)</p>
    ),
  };

  return (
    <>
      <Navbar />
      <div className="mini-ai-container">
        <h1>Mini AI Experience</h1>
        <div className="mini-tool-content">
          {toolContent[miniToolId] || <p>Mini version not available.</p>}
        </div>

        <button onClick={() => navigate(-1)} className="btn back-btn">
          Back
        </button>
      </div>
    </>
  );
};

export default MiniAITool;
