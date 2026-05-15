export const API_URL = 'http://127.0.0.1:5000/api';

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };


    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
};

export const authService = {
    login: async (email, password) => {
        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (err) {
            // Fallback to mock auth when backend is unavailable
            if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
                const mockToken = 'mock-token-' + Date.now();
                const mockUser = { name: email.split('@')[0], email, id: 'local-' + Date.now() };
                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                return { token: mockToken, user: mockUser };
            }
            throw err;
        }
    },
    register: async (name, email, password) => {
        try {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (err) {
            // Fallback to mock auth when backend is unavailable
            if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
                const mockToken = 'mock-token-' + Date.now();
                const mockUser = { name, email, id: 'local-' + Date.now() };
                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                return { token: mockToken, user: mockUser };
            }
            throw err;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const resumeService = {
    getAll: async () => {
        return apiRequest('/resumes');
    },
    getById: async (id) => {
        return apiRequest(`/resumes/${id}`);
    },
    create: async (data) => {
        return apiRequest('/resumes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return apiRequest(`/resumes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
};

export default apiRequest;
