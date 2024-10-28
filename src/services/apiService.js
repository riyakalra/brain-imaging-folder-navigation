import axios from 'axios';

const API_BASE_URL = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample';

export const getFileList = async (prefix, pageToken = '') => {
    const response = await axios.get(`${API_BASE_URL}/files`, { params: { prefix, pageToken } });
    return response.data.data;
};

export const getFolderPreview = async (key, pageToken = '') => {
    if(!key) return;
    const response = await axios.get(`${API_BASE_URL}/folder/preview`, { params: { key, pageToken } });
    return response.data;
};

export const downloadFile = async (key, isZip) => {
    const response = await axios.get(`${API_BASE_URL}/download/url`, { params: { key, isZip } });
    return response.data.data;
};

export const downloadFolder = async (folderPrefix, files, zipFileName) => {
    const requestBody = {
        ...(folderPrefix ? { folderPrefix } : {}),
        ...(files.length > 0 ? { files } : {}),
        zipFileName,
    };

    const response = await axios.post(`${API_BASE_URL}/download`, requestBody);
    return response.data;
};


export const getDownloadStatus = async (downloadId) => {
    const response = await axios.get(`${API_BASE_URL}/download/progress/${downloadId}`);
    return response.data;
};

export const cancelDownload = async (refId, zipKey) => {
    const response = await axios.delete(`${API_BASE_URL}/download/cancel`, { params: { refId, zipKey } });
    return response.data.data;
};

export const previewImage = async (downsampledFileKey) => {
    const response = await axios.get(`https://3f2bkpjjxc.execute-api.us-east-1.amazonaws.com/plc/get-downsampled-image/${downsampledFileKey}`,
        {
            responseType: 'blob' // Ensures the response is treated as a binary Blob
        }
    );
    return await response.data;
};
