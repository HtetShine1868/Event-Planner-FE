// src/features/feedback/feedbackAPI.js
import axiosInstance from '../../services/axiosInstance';

export const getFeedbackSummary = async (eventId) => {
  const response = await axiosInstance.get(`/feedback/event/${eventId}/feedback-summary`);
  return response.data;
};

export const submitFeedback = async (feedbackData) => {
  // feedbackData = { eventId, rating, comment }
  const response = await axiosInstance.post('/feedback', feedbackData);
  return response.data;
};
