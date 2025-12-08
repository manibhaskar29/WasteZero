const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5173/api/auth";


export async function fetchOpportunities() {
  const res = await fetch(`${API_URL}/opportunities`);
  return res.json();
}

export async function fetchOpportunityById(id) {
  const res = await fetch(`${API_URL}/opportunities/${id}`);
  return res.json();
}

export async function createOpportunity(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/opportunities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateOpportunity(id, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/opportunities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // must be NGO token
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update opportunity");
  }

  return res.json();
}

export async function deleteOpportunity(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/opportunities/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // must be NGO token
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete opportunity");
  }

  return await res.json();
}
