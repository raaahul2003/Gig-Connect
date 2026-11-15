
import api from "../api/axios";

// Get client payment history
export const getClientPayments = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view payments.");
  }

  const response = await api.get("/payments/client", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Create Razorpay order
export const createRazorpayOrder = async (paymentId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to make a payment.");
  }

  const response = await api.post(
    "/payments/create-order",
    { paymentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to verify your payment.");
  }

  const response = await api.post(
    "/payments/verify",
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get freelancer earnings
export const getFreelancerEarnings = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view earnings.");
  }

  const response = await api.get("/payments/earnings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
