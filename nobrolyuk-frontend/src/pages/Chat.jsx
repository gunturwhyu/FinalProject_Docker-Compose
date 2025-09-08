import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function ChatPage() {
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);
  const wsReady = useRef(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const profileLoaded = useRef(false);
  const convosLoaded = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load profile
  useEffect(() => {
    if (profileLoaded.current) return;
    profileLoaded.current = true;

    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/api/v1/users/profile");
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
        navigate("/login");
        a;
      }
    };
    fetchProfile();
  }, [navigate]);

  // Load conversations
  useEffect(() => {
    if (convosLoaded.current) return;
    convosLoaded.current = true;

    const fetchConvos = async () => {
      try {
        const data = await apiFetch("/api/v1/chat/conversations");
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    fetchConvos();
  }, []);

  // Setup WebSocket
  useEffect(() => {
    if (!profile) return;

    const wsUrl = `ws://localhost:8080/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("✅ WebSocket connected");
      setWs(websocket);
      wsReady.current = true; // ✅ Mark as ready
    };

    websocket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (
          selectedChat &&
          (msg.sender_id === selectedChat || msg.receiver_id === selectedChat)
        ) {
          setMessages((prev) => [...prev, msg]);
        }

        setConversations((prev) =>
          prev.map((c) =>
            c.user.id === msg.sender_id
              ? {
                  ...c,
                  last_message: {
                    content: msg.content,
                    sender_id: msg.sender_id,
                  },
                }
              : c
          )
        );
      } catch (err) {
        console.error("Failed to parse WebSocket message", err);
      }
    };

    websocket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      wsReady.current = false;
    };

    return () => {
      websocket.close();
      wsReady.current = false;
    };
  }, [profile, selectedChat]);

  // Auto-load selected user from /search
  useLayoutEffect(() => {
    const userId = location.state?.selectedUser;
    if (userId && !selectedChat) {
      loadMessages(userId);

      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, selectedChat]);

  // Load messages and user info
  const loadMessages = async (userId) => {
    setSelectedChat(userId);
    setLoading(true);
    setMessages([]);

    try {
      const data = await apiFetch(`/api/v1/chat/messages?user_id=${userId}`);
      setMessages(data.messages || []);

      // Mark as read
      await apiFetch(`/api/v1/chat/read/${userId}`, { method: "PUT" });

      // Update unread count
      setConversations((prev) =>
        prev.map((c) => (c.user.id === userId ? { ...c, unread_count: 0 } : c))
      );

      // Get user info for header
      const userInConvo = conversations.find((c) => c.user.id === userId);
      if (userInConvo) {
        setSelectedUserInfo(userInConvo.user);
      } else {
        try {
          const userData = await apiFetch(`/api/v1/users/${userId}`);
          setSelectedUserInfo(userData);
        } catch (err) {
          setSelectedUserInfo({ username: "Pengguna" });
        }
      }
    } catch (err) {
      console.error("Failed to load messages", err);
      setSelectedUserInfo({ username: "Pengguna" });
    } finally {
      setLoading(false);
    }
  };
  // Send message via WebSocket
  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("📩 sendMessage called");
    if (!newMessage.trim()) return;
    if (!selectedChat) return;
    if (!ws || !wsReady.current) {
      alert("Tidak terhubung ke obrolan. Coba refresh.");
      return;
    }

    const msgData = {
      receiver_id: selectedChat,
      content: newMessage,
      type: "text",
    };

    try {
      ws.send(JSON.stringify(msgData));
      console.log("✅ Sent via WS", msgData);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Gagal mengirim pesan");
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex h-screen bg-gray-50 font-outfit">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header with Profile + Username */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {/* 🔥 Clickable Profile + Name */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors flex-1"
          >
            {/* Profile Initial Circle */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {profile?.username
                ? profile.username.charAt(0).toUpperCase()
                : "U"}
            </div>

            {/* Username */}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profile?.username || "Pengguna"}
              </p>
            </div>
          </div>

          {/* New Chat Button */}
          <Link
            to="/search"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
            title="Cari pengguna"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
            </svg>
          </Link>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Belum ada obrolan</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.user.id}
                onClick={() => loadMessages(c.user.id)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedChat === c.user.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <img
                      src={c.user.avatar || "https://placehold.co/40"}
                      alt={c.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {c.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {c.user.username}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {c.last_message?.content || "Tidak ada pesan"}
                    </p>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {c.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedUserInfo?.username || "Pengguna"}
                <span className="ml-2 text-xs text-green-500">online</span>
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {loading ? (
                <p className="text-center text-gray-500">Memuat pesan...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada pesan</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === profile?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender_id === profile?.id
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t bg-white flex gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-full transition-colors"
              >
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Pilih obrolan untuk mulai mengobrol
          </div>
        )}
      </div>
    </div>
  );
}
