// pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/api/v1/users/profile");
        setProfile(data);
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        alert("Gagal memuat profil. Silakan login ulang.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/v1/users/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      // Update local profile
      setProfile((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Gagal memperbarui profil. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (!window.confirm("Yakin ingin keluar?")) return;

    try {
      await apiFetch("/api/v1/auth/logout", {
        method: "POST",
      });
      // Clear any local data
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Gagal keluar. Coba lagi.");
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600">Memuat profil...</p>
      </div>
    );
  }

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
        <h1 className="text-lg font-semibold text-gray-900">Profil Saya</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3"
              style={{
                backgroundImage: profile.avatar ? `url(${profile.avatar})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!profile.avatar && profile.username?.charAt(0).toUpperCase()}
            </div>

            <h2
              className="text-xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 40%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              {profile.username || "Pengguna"}
            </h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tentang saya..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://placehold.co/200"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: profile.username || "",
                      bio: profile.bio || "",
                      avatar: profile.avatar || "",
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <strong className="text-sm text-gray-600">Email</strong>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <strong className="text-sm text-gray-600">Bio</strong>
                <p className="text-gray-800">{profile.bio || "Tidak ada bio"}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Edit Profil
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}