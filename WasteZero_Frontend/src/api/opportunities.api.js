const API_URL = "http://localhost:5173/api/opportunities";

export async function fetchOpportunities() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function fetchOpportunityById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createOpportunity(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
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

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
