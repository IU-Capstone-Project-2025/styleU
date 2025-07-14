import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// 🔐 Login (POST /auth/login)
export const loginUser = async ({ username, password }) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${BASE_URL}/auth/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  return response.data; // contains: { access_token: "..." }
};

// 🆕 Registration (POST /auth/register)
export const registerUser = async ({ username, password }) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    username,
    password,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return response.data; // contains: { access_token: "..." }
};

// 📊 Analyze Body Shape (POST /analyze_figure)
export const analyzeFigure = async (data, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(`${BASE_URL}/analyze_figure`, data, { headers });
  return response.data;
};

// 🎨 Analyze Color Type (POST /analyze_color)
export const analyzeColor = async (file, token = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(`${BASE_URL}/analyze_color`, formData, {
    headers,
  });

  return response.data;
};

// 🧑‍🎨 Generate Avatar (GET /generate_avatar)
export const generateAvatar = async (token) => {
  if (!token) throw new Error("Token is required to generate avatar");

  const response = await axios.post(`${BASE_URL}/generate_avatar`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    responseType: 'blob', // <- это важно: мы ожидаем изображение!
  });
  

  return response.data; // <- это будет blob (изображение)
};

// ✅ Test Server Status (GET /api/hello)
export const checkServer = async () => {
  const response = await axios.get(`${BASE_URL}/api/hello`);
  return response.data;
};
