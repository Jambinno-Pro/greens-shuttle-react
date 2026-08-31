const API_URL = "http://localhost:5000";

/* =========================================================
   AUTHENTICATED API REQUEST
========================================================= */

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  const headers = {
    ...(options.headers || {}),
  };

  /* =====================================================
     ADD JWT
  ===================================================== */

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  /* =====================================================
     JSON CONTENT TYPE
     Don't add it when using FormData.
  ===================================================== */

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  /* =====================================================
     SESSION EXPIRED / INVALID TOKEN
  ===================================================== */

  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/login";

    throw new Error("Your session has expired. Please log in again.");
  }

  /* =====================================================
     RESPONSE
  ===================================================== */

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

export { API_URL };
