import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import App from './App.jsx'
import Chat from "./pages/Chat.jsx";
import SearchUserPage from "./pages/SearchUserPage.jsx";
import Profile from "./pages/Profile.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/search" element={<SearchUserPage />} />
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
