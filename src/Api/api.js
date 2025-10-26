// Centralized API utility for making authenticated requests
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Build headers with authentication
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic fetch wrapper with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.buildHeaders(options.headers),
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      // Parse JSON response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file (multipart/form-data)
  async upload(endpoint, formData) {
    const token = this.getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error(`Upload Error (${endpoint}):`, error);
      throw error;
    }
  }
}

// API endpoints organized by domain
export const moviesAPI = {
  getAll: () => api.get('/api/v1/movies'),
  getById: (id) => api.get(`/api/v1/movies/${id}`),
  search: (query) => api.get(`/api/v1/movies/search?q=${encodeURIComponent(query)}`),
};

export const reviewsAPI = {
  getByMovieId: (movieId) => api.get(`/api/v1/reviews/movie/${movieId}`),
  create: (reviewData) => api.post('/api/v1/reviews', reviewData),
  update: (id, reviewData) => api.put(`/api/v1/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/api/v1/reviews/${id}`),
};

export const favoritesAPI = {
  getAll: () => api.get('/api/v1/favorites'),
  add: (movieId) => api.post('/api/v1/favorites', { movieId }),
  remove: (movieId) => api.delete(`/api/v1/favorites/${movieId}`),
  check: (movieId) => api.get(`/api/v1/favorites/check/${movieId}`),
};

export const watchlistAPI = {
  getAll: () => api.get('/api/v1/watchlist'),
  add: (movieId) => api.post('/api/v1/watchlist', { movieId }),
  remove: (movieId) => api.delete(`/api/v1/watchlist/${movieId}`),
};

export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  register: (userData) => api.post('/api/v1/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => api.get('/api/v1/auth/me'),
};

// Create and export the API service instance
const api = new ApiService();
export default api;