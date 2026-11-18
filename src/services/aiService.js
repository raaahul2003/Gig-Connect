import api from "../api/axios";

export const generateProposal = async (data) => {
  const response = await api.post("/ai/generate-proposal", data);
  return response.data;
};

export const generateTaskDescription = async (data) => {
  const response = await api.post("/ai/generate-task-description", data);
  return response.data;
};
