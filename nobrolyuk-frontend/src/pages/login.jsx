import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Invalid credentials");
      }

      console.log("✅ Login successful:", data);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/chat");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)`,
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite",
        }}
      ></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl border border-gray-200">
        {/* Title with Gradient */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #4FACFE 0%, #00F2FE 40%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              backgroundSize: "200% auto",
              animation: "textShine 4s linear infinite",
            }}
          >
            Ngobrol.Yuk
          </h1>
          <p className="text-sm text-gray-600 mt-1">Masuk untuk melanjutkan</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="masukkan email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 5.5a.5.5 0 0 1 .5-.5H10a.5.5 0 0 1 0 1H8.5a.5.5 0 0 1-.5-.5zM11 9a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5zm-5 0a.5.5 0 0 1 .5-.5H8a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5z" />
                    <path d="M14.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM13 7.5c.5 0 1 .5 1 1s-.5 1-1 1c-.5 0-1-.5-1-1s.5-1 1-1zM8 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-1.5 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-1.5-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memuat..." : "Lanjut ke Obrolan"}
          </button>
        </form>

        {/* Sign-up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}

// Add animations (same as landing page)
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
`;
document.head.appendChild(style);

export default Login;
