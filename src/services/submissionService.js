
import api from "../api/axios";

// 1. Freelancer submits work
export async function submitWork(taskId, formData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in before submitting work.");
  }

  const response = await api.post(
    `/submissions/${taskId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// 2. Freelancer views their submissions
export async function getMySubmissions() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your submissions.");
  }

  const response = await api.get("/submissions/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.submissions || [];
}

// 3. Client views received submissions
export async function getSubmissionsForClient() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view submissions.");
  }

  const response = await api.get("/submissions/client", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.submissions || [];
}

// 4. Client approves work or requests revisions
export async function reviewSubmission(submissionId, status, feedback = "") {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to review this submission.");
  }

  const response = await api.patch(
    `/submissions/${submissionId}/review`,
    { status, feedback },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// 5. View or download a submission file
export async function downloadSubmissionFile(submissionId, fileId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to access this file.");
  }

  const response = await api.get(
    `/submissions/${submissionId}/files/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
}
