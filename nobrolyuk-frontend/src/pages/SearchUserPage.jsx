// pages/SearchUserPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function SearchUserPage() {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Load all users on mount
  useEffect(() => {
    const loadAllUsers = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/api/v1/users?page=1&limit=100");
        
        if (Array.isArray(data.users)) {
          setAllUsers(data.users);
          setFilteredUsers(data.users); // Show all by default
        } else {
          console.warn("Invalid response format:", data);
          setAllUsers([]);
          setFilteredUsers([]);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
        alert("Gagal memuat daftar pengguna. Coba lagi.");
        setAllUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllUsers();
  }, []);

  // 🔹 Filter users when search changes
  useEffect(() => {
    if (!Array.isArray(allUsers)) return;

    const term = search.toLowerCase().trim();

    if (term === "") {
      // Show all users if search is empty
      setFilteredUsers(allUsers);
      return;
    }

    // Filter users by username or email (safe check)
    const filtered = allUsers.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      return username.includes(term) || email.includes(term);
    });

    setFilteredUsers(filtered);
  }, [search, allUsers]); // ✅ Depend on both

  // Start chat with selected user
  const startChat = (userId) => {
    navigate("/chat", { state: { selectedUser: userId } });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.146-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </button>
        <h1
          className="text-lg font-semibold text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 40%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
          }}
        >
          Cari Pengguna
        </h1>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-500 mr-2" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="text-center py-4 text-gray-500">
            🔍 Memuat pengguna...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {search ? "Tidak ada pengguna ditemukan" : "Tidak ada pengguna"}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => startChat(user.id)}
              className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
            >
              <div className="relative mr-3">
                <img
                  src={user.avatar || "https://placehold.co/40"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{user.username}</h3>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}