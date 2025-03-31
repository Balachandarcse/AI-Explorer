import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import "../css/home.css";
import ex from "../assets/ex.jpg"

const tools = [
  { 
    id: "image-generator", 
    name: "AI Image Generator", 
    description: "Generate AI-powered images instantly.",
    imageUrl: ex, // Add image URL here
    miniVersion: "image-generator-mini", 
    visitUrl: "https://deepai.org/machine-learning-model/text2img", 
  },
  { 
    id: "chatbot", 
    name: "Chatbot AI", 
    description: "A smart AI chatbot for instant responses.",
    imageUrl: "/images/chatbot.jpg", // Add image URL here
    miniVersion: "chatbot-mini", 
    visitUrl: "https://chat.openai.com/", 
  },
  { 
    id: "code-assistant", 
    name: "Code Assistant", 
    description: "AI that helps you write better code.",
    imageUrl: "/images/code-assistant.jpg", // Add image URL here
    miniVersion: "code-assistant-mini", 
    visitUrl: "https://github.com/copilot", 
  },
  { 
    id: "speech-to-text", 
    name: "Speech to Text", 
    description: "Convert spoken words into text easily.",
    imageUrl: "/images/speech-to-text.jpg", // Add image URL here
    miniVersion: "speech-to-text-mini", 
    visitUrl: "https://otter.ai/", 
  },
  { 
    id: "gamma", 
    name: "Gamma AI", 
    description: "Generate presentations instantly using AI.",
    imageUrl: "/images/gamma.jpg", // Add image URL here
    miniVersion: "gamma-mini", 
    visitUrl: "https://gamma.app/", 
  },
  { 
    id: "content-writer", 
    name: "AI Content Writer", 
    description: "Create blog posts and articles using AI.",
    imageUrl: "/images/content-writer.jpg", // Add image URL here
    miniVersion: "content-writer-mini", 
    visitUrl: "https://writesonic.com/", 
  },
  { 
    id: "music-composer", 
    name: "AI Music Composer", 
    description: "Create music compositions with AI assistance.",
    imageUrl: "/images/music-composer.jpg", // Add image URL here
    miniVersion: "music-composer-mini", 
    visitUrl: "https://soundraw.io/", 
  },
  { 
    id: "voice-cloning", 
    name: "Voice Cloning AI", 
    description: "Clone any voice and generate speech with it.",
    imageUrl: "/images/voice-cloning.jpg", // Add image URL here
    miniVersion: "voice-cloning-mini", 
    visitUrl: "https://descript.com/overdub", 
  },
  { 
    id: "text-summarizer", 
    name: "Text Summarizer AI", 
    description: "Summarize long articles and texts.",
    imageUrl: "/images/text-summarizer.jpg", // Add image URL here
    miniVersion: "text-summarizer-mini", 
    visitUrl: "https://smmry.com/", 
  },
  { 
    id: "video-editor", 
    name: "AI Video Editor", 
    description: "Edit and generate videos using AI.",
    imageUrl: "/images/video-editor.jpg", // Add image URL here
    miniVersion: "video-editor-mini", 
    visitUrl: "https://runwayml.com/", 
  },
  { 
    id: "image-enhancer", 
    name: "AI Image Enhancer", 
    description: "Enhance and upscale images with AI.",
    imageUrl: "/images/image-enhancer.jpg", // Add image URL here
    miniVersion: "image-enhancer-mini", 
    visitUrl: "https://letsenhance.io/", 
  },
  { 
    id: "voice-to-text", 
    name: "Voice to Text AI", 
    description: "Convert voice recordings into text.",
    imageUrl: "/images/voice-to-text.jpg", // Add image URL here
    miniVersion: "voice-to-text-mini", 
    visitUrl: "https://rev.com/automated-transcription", 
  },
  { 
    id: "virtual-assistant", 
    name: "AI Virtual Assistant", 
    description: "Get your tasks done with an AI-powered assistant.",
    imageUrl: "/images/virtual-assistant.jpg", // Add image URL here
    miniVersion: "virtual-assistant-mini", 
    visitUrl: "https://x.ai/", 
  },
  { 
    id: "data-analytics", 
    name: "AI Data Analytics", 
    description: "Analyze and visualize data with AI assistance.",
    imageUrl: "/images/data-analytics.jpg", // Add image URL here
    miniVersion: "data-analytics-mini", 
    visitUrl: "https://www.h2o.ai/", 
  },
];


const Home = () => {
  const navigate = useNavigate();

  const handleExplore = (toolId, miniVersion) => {
    navigate(`/tools/${toolId}`, { state: { miniVersion } });
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1 className="intro">Welcome to AI Explorer</h1>
        <h2 className="sub-intro">Discover and interact with a variety of AI applications</h2>

        <div className="tools-container">
  {tools.map((tool) => (
    <div key={tool.id} className="tool-card">
      <img 
        src={tool.imageUrl} 
        alt={tool.name} 
        className="tool-image"
      />
      <h3 className="tool-name">{tool.name}</h3>
      <p className="tool-description">{tool.description}</p>
      <button 
        className="explore-btn" 
        onClick={() => handleExplore(tool.id, tool.miniVersion)}
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
