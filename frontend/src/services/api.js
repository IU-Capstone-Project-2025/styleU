// src/services/api.js
import axios from 'axios';

// POST /analyze_figure
export async function analyzeFigure(data) {
  const response = await axios.post('/api/analyze_figure', data);
  return response.data;
}

// POST /analyze_color
export async function analyzeColor(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/analyze_color', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}
