const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const withAuth = (headers = {}) => {
  if (typeof window === "undefined") {
    return headers;
  }

  const token = localStorage.getItem("vb_token");
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...withAuth(options.headers),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const storeSession = ({ token, user }) => {
  localStorage.setItem("vb_token", token);
  localStorage.setItem("vb_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("vb_token");
  localStorage.removeItem("vb_user");
};
