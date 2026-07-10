import api from './axios';

export const getVenues = async () => {
    const response = await api.get('/venues');
    return response.data;
};

export const createVenue = async (venueData) => {
    const response = await api.post('/admin/venues', venueData);
    return response.data;
};

export const updateVenue = async (id, venueData) => {
    const response = await api.put(`/admin/venues/${id}`, venueData);
    return response.data;
};

export const deleteVenue = async (id) => {
    const response = await api.delete(`/admin/venues/${id}`);
    return response.data;
};
