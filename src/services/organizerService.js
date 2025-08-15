import API from './axiosInstance';

export const fetchOrganizerEvents = async (organizerId, page = 0, size = 5) => {
  const response = await API.get(`/organizers/${organizerId}/events?page=${page}&size=${size}`);
  return response.data;
};
