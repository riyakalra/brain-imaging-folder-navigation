import axios from 'axios';

const API_BASE_URL = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample';

export const getFileList = async (prefix, pageToken = '') => {
   const response = await axios.get(`${API_BASE_URL}/files`, { params: { prefix, pageToken } });
   return response.data;
};

export const getFolderPreview = async (key, pageToken = '') => {
   const response = await axios.get(`${API_BASE_URL}/folder/preview`, { params: { key, pageToken } });
   return response.data;
};