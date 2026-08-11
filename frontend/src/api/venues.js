import api from './axios';

// --- Venues (Recintos) ---
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

// --- Location Types (Tipos de Locaciones) ---
export const getLocationTypes = async () => {
    const response = await api.get('/admin/location-types');
    return response.data;
};

export const createLocationType = async (data) => {
    const response = await api.post('/admin/location-types', data);
    return response.data;
};

export const updateLocationType = async (id, data) => {
    const response = await api.put(`/admin/location-types/${id}`, data);
    return response.data;
};

export const deleteLocationType = async (id) => {
    const response = await api.delete(`/admin/location-types/${id}`);
    return response.data;
};
