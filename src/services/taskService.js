import api from "../api/axios";


export function createTask(task, token, submissionKey) {
  return api.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": submissionKey,
    },
  });
}
export const getTasks = () => api.get("/tasks");
export const getTaskById = (taskId) => api.get(`/tasks/${taskId}`);


export const deleteTask = async (taskId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to delete a task.");
  }

  const response = await api.delete(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

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