import api from './axios';

export const getFeedbacks = async (eventId, versionId) => {
    const response = await api.get(`/events/${eventId}/versions/${versionId}/feedbacks`);
    return response.data;
};

export const createFeedback = async (eventId, versionId, data) => {
    const response = await api.post(`/events/${eventId}/versions/${versionId}/feedbacks`, data);
    return response.data;
};

export const resolveFeedback = async (feedbackId) => {
    const response = await api.patch(`/feedbacks/${feedbackId}/resolve`);
    return response.data;
};

export const getPendingFeedbacks = async () => {
    const response = await api.get('/feedbacks/pending');
    return response.data;
};
