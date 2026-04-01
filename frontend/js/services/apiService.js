import { API_BASE_URL } from '../constants.js';

class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('jwt_token');
        
        const headers = { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers 
        };

        try {
            const response = await fetch(url, { ...options, headers });
            const responseData = await response.json();

            if (response.status === 401 || response.status === 403) {
                if(response.status === 401) {
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_data');
                    window.location.href = '/login';
                }
                throw new Error(responseData.message || 'Akses ditolak.');
            }

            if (!response.ok) {
                throw new Error(responseData.message || 'Terjadi kesalahan pada server');
            }
            return responseData;
        } catch (error) {
            throw error; 
        }
    }

    static get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
    static post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); }
    static put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); }
    static delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export default ApiService;