import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const validateImage = async (file, analysisType = 'ai_validation', analysisContext = 'general') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('analysisType', analysisType);
  formData.append('analysisContext', analysisContext);

  try {
    const response = await api.post('/api/images/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error('An unexpected error occurred while communicating with the server.');
  }
};
