// API base URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Make API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is ok
    if (!response.ok) {
      // Try to parse error message
      let errorMessage = 'Something went wrong';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (username, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (topic = null) => {
    const query = topic ? `?topic=${topic}` : '';
    return apiRequest(`/leaderboard${query}`);
  },

  updateScore: async (topic, score, maxScore = 10, timeTaken = 0) => {
    return apiRequest('/leaderboard/update-score', {
      method: 'POST',
      body: JSON.stringify({ topic, score, maxScore, timeTaken }),
    });
  },

  updateMissionScore: async (topic, score, maxScore = 10) => {
    return apiRequest('/leaderboard/update-mission-score', {
      method: 'POST',
      body: JSON.stringify({ topic, score, maxScore }),
    });
  },

  getMyProgress: async () => {
    return apiRequest('/leaderboard/my-progress');
  },
};

export default apiRequest;

