import api from './axios';

export const getUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};
