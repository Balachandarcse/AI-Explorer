import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import "../css/ai-tool.css";

const aiTools = {
  "image-generator": {
    name: "AI Image Generator",
    description: "Generate AI-powered images instantly.",
    content: "Enter a description and generate an AI image.",
    miniVersion: "image-generator-mini",
    visitUrl: "https://deepai.org/machine-learning-model/text2img",
  },
  chatbot: {
    name: "Chatbot AI",
    description: "A smart AI chatbot for instant responses.",
    content: "Chat with an AI assistant.",
    miniVersion: "chatbot-mini",
    visitUrl: "https://chat.openai.com/",
  },
  "code-assistant": {
    name: "Code Assistant",
    description: "AI that helps you write better code.",
    content: "AI-powered coding suggestions.",
    miniVersion: "code-assistant-mini",
    visitUrl: "https://github.com/copilot",
  },
  "speech-to-text": {
    name: "Speech to Text",
    description: "Convert spoken words into text easily.",
    content: "Speak into your microphone, and AI will transcribe your words.",
    miniVersion: "speech-to-text-mini",
    visitUrl: "https://otter.ai/",
  },
};

const AITool = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();

  const tool = aiTools[toolId];

  if (!tool) {
    return (
      <>
        <Navbar />
        <div className="ai-tool-container">
          <h1>Tool Not Found</h1>
          <p>The requested AI tool does not exist.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="ai-tool-container">
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
        <div className="tool-content">
          <p>{tool.content}</p>
        </div>

        <div className="ai-tool-buttons">
          <button onClick={() => navigate(`/mini/${tool.miniVersion}`)} className="btn try-btn">
            Try Mini Version
          </button>
          <button onClick={() => window.open(tool.visitUrl, "_blank")} className="btn visit-btn">
            Visit {tool.name}
          </button>
        </div>
      </div>
    </>
  );
};

export default AITool;
