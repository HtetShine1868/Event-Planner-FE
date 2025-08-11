import axiosInstance from '../../services/axiosInstance';

// Submit feedback for event
export const submitFeedback = async (eventId, feedbackData) => {
  // feedbackData = { rating: number, comment: string }
  const response = await axiosInstance.post(`/feedbacks/${eventId}/feedback`, feedbackData);
  return response.data;
};

// Get feedback summary for event
export const getFeedbackSummary = async (eventId) => {
  const response = await axiosInstance.get(`/feedbacks/${eventId}/feedback-summary`);
  return response.data;
};

// Check if current user has submitted feedback for event
export const getUserFeedback = async (eventId) => {
  const response = await axiosInstance.get(`/feedbacks/${eventId}/my-feedback`);
  // You may need to implement backend endpoint /feedbacks/{eventId}/feedback/my
  // or adjust accordingly to get current user's feedback.
  return response.data;
};
