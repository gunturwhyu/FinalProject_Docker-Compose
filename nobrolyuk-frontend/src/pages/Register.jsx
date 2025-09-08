import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (password !== confirmPassword) {
    setError("Kata sandi tidak cocok");
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name, email, password }),
    });

    const data = await res.json(); 

    if (!res.ok) {
      throw new Error(data.message || "Gagal mendaftar");
    }

    console.log("✅ Register successful:", data);
    navigate("/login");
  } catch (err) {
    console.error(err);
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

      {/* Register Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl border border-gray-200">
        {/* Title with Gradient */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 40%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundSize: '200% auto',
              animation: 'textShine 4s linear infinite',
            }}
          >
            Ngobrol.Yuk
          </h1>
          <p className="text-sm text-gray-600 mt-1">Daftar untuk memulai obrolan</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="name"
              placeholder="masukkan nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              placeholder="buat kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Mendaftar..." : "Buat Akun"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}

// Reuse animations from login/landing
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

export default Register;