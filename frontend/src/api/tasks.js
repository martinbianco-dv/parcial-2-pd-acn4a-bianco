const API_BASE =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") || "";

const BASE_URL = API_BASE ? `${API_BASE}/api/tasks` : "/api/tasks";

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error en la petición");
  }
  if (res.status === 204) return null;
  return res.json();
};

export const fetchTasks = async () => {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
};

export const createTask = async (task) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
};

export const toggleTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
};

export const removeTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return handleResponse(res);
};
