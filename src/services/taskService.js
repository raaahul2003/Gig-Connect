import api from "../api/axios";

export function createTask(task, token) {
  return api.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}