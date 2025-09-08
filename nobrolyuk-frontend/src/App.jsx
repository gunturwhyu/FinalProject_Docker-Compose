import { useNavigate } from "react-router-dom";
import apiFetch from "./utils/apiFetch"; // Make sure this exists
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle "Lanjut ke Obrolan" with auth check
  const handleContinue = async () => {
    setLoading(true);
    try {
      // Try to get profile → if success, user is logged in
      await apiFetch("/api/v1/users/profile");
      navigate("/chat");
    } catch (err) {
      // If fails (401), user is not logged in
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)`,
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite",
        }}
      ></div>

      {/* Main Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-200 overflow-hidden mx-4 transform transition-all hover:scale-105 duration-300">
        {/* Soft Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-transparent to-indigo-50 opacity-50"></div>

        {/* Content */}
        <div className="relative p-10 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <svg width="80" height="80" viewBox="0 0 64 64" className="drop-shadow-lg transition-transform hover:rotate-6 duration-300">
              <circle cx="32" cy="32" r="30" fill="url(#gradient)" />
              <text
                x="32"
                y="40"
                fontFamily="Outfit, sans-serif"
                fontSize="28"
                fontWeight="700"
                textAnchor="middle"
                fill="white"
              >
                NY
              </text>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4FACFE" />
                  <stop offset="100%" stopColor="#00F2FE" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1
              className="text-4xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 40%, #8B5CF6 70%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                backgroundSize: '200% auto',
                animation: 'textShine 4s linear infinite',
              }}
            >
              Ngobrol.Yuk
            </h1>

            <div className="flex justify-center">
              <div
                className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #4FACFE, #8B5CF6)',
                  boxShadow: '0 0 15px rgba(79, 172, 254, 0.4)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              ></div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto font-light">
            Ngobrol real-time dengan teman, keluarga, dan rekan kerja — cepat, simpel, dan gratis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handleContinue}
              disabled={loading}
              className="group relative rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95 hover:from-blue-500 hover:to-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? "Memuat..." : "Lanjut ke Obrolan"}
              </span>
              <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></span>
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="group relative rounded-xl border border-gray-300 bg-white/90 px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-50 active:scale-95"
            >
              <span className="relative z-10">Buat Akun</span>
              <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></span>
            </button>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-gray-600 font-medium">
        Dibuat dengan ❤️ untuk percakapan real-time
      </p>
    </div>
  );
}

// Animations
const style = document.createElement("style");
style.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes textShine {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scaleX(1); }
    50% { opacity: 1; transform: scaleX(1.2); }
  }
`;
document.head.appendChild(style);

export default App;