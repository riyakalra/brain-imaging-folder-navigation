import axios from 'axios';

const API_BASE_URL = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample';

export const getFileList = async (prefix, pageToken = '') => {
    const response = await axios.get(`${API_BASE_URL}/files`, { params: { prefix, pageToken } });
    return response.data.data;
};

export const getFolderPreview = async (key, pageToken = '') => {
    const response = await axios.get(`${API_BASE_URL}/folder/preview`, { params: { key, pageToken } });
    return response.data;
};

export const downloadFile = async (key) => {
    const response = await axios.get(`${API_BASE_URL}/download`, { params: { key } });
    return response.data.data;
};

export const getDownloadStatus = async (downloadId) => {
    const response = await axios.get(`${API_BASE_URL}/download/status`, { params: { downloadId } });
    return response.data.data;
};

export const cancelDownload = async (downloadId) => {
    const response = await axios.delete(`${API_BASE_URL}/download/cancel`, { params: { downloadId } });
    return response.data.data;
};

export const previewImage = async (key) => {
    const response = await axios.get(`${API_BASE_URL}/image/preview`, { params: { key } });
    return response.data.data;
};
