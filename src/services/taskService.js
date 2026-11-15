import api from "../api/axios";


export function createTask(task, token) {
  return api.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getTasks = () => api.get("/tasks");
export const getTaskById = (taskId) => api.get(`/tasks/${taskId}`);

// Get tasks posted by the logged-in client
export const getMyTasks = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your tasks.");
  }

  const response = await api.get("/tasks/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.tasks || [];
};