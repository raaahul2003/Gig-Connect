
import api from "../api/axios";

// Fetch logged-in user's profile
export const getMyProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

// Update logged-in user's profile
export const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

// Fetch another user's public profile
export const getPublicProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

// Upload freelancer profile photo
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();

  formData.append("photo", file);

  const response = await api.post(
    "/users/profile/photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Fetch freelancer's completed work history
export const getFreelancerWorkHistory = async (userId) => {
  const response = await api.get(`/users/${userId}/work-history`);
  return response.data;
};