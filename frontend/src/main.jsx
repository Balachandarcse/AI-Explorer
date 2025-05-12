import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';
import AITool from './components/AITool.jsx';
// import MiniAITool from './components/MiniAITool.jsx';
import AdminDashboard from './components/admin .jsx';
import Category from './components/Category.jsx';
import SearchResults from './components/SearchResults.jsx';
import About from './components/about.jsx';
import Contact from './components/Contact.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path="/tools/:toolId" element={<AITool />} />
        {/* <Route path="/mini/:miniToolId" element={<MiniAITool />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/category" element={<Category />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
