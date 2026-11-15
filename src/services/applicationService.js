import api from "../api/axios";

export async function submitApplication(taskId, applicationData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in before applying for this task.");
  }

  const response = await api.post(
    `/applications/${taskId}`,
    applicationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getMyApplications() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in before viewing your applications.");
  }

  const response = await api.get("/applications/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.applications || [];
}

// Get applications received by the logged-in client
export async function getApplicationsForClient() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view received applications.");
  }

  const response = await api.get("/applications/client", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.applications || [];
}

// Update application status (Accept / Reject)
export async function updateApplicationStatus(applicationId, status) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to update this application.");
  }

  const response = await api.patch(
    `/applications/${applicationId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


// Get accepted active work for the logged-in freelancer
export async function getMyActiveWork() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your active work.");
  }

  const response = await api.get("/applications/active/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.applications || [];
}


// Get active work assigned to freelancers by the logged-in client
export async function getClientActiveWork() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view active work.");
  }

  const response = await api.get("/applications/active/client", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.applications || [];
}
