// utils/apiFetch.js

const BASE_URL = "http://localhost:8080";
const apiFetch = async (path, options = {}) => {
  const config = {
    ...options,
    credentials: "include", // penting biar cookie JWT ikut
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  console.log("apiFetch: request =>", BASE_URL + path);

  try {
    const res = await fetch(BASE_URL + path, config);

    console.log("apiFetch: response status", res.status);

    if (res.status === 401) {
      console.log("Unauthorized → clear session");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data.error || data.message || message;
      } catch {}
      throw new Error(message);
    }

    return await res.json();
  } catch (err) {
    console.error("apiFetch error:", err);
    throw err;
  }
};

export default apiFetch;
