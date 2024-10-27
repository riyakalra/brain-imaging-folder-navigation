import React, { useEffect, useState } from 'react';
import { getFileList, getFolderPreview, downloadFile, getDownloadStatus, cancelDownload } from '../services/apiService';
import FolderPreview from './FolderPreview';

const FileList = () => {
    const [folders, setFolders] = useState([]);
    const [previewFolder, setPreviewFolder] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const { subFolders } = await getFileList('');
                const initialFolders = subFolders.map(folder => ({
                    name: folder,
                    subFolders: [],
                    files: [],
                    isOpen: false,
                    nextContinuationToken: null, // Initialize for load more
                }));
                setFolders(initialFolders);
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };

        fetchFolders();
    }, []);

    const toggleFolder = async (folder) => {
        if (folder.isOpen) {
            folder.isOpen = false;
            setFolders([...folders]);
            return;
        }

        folder.isOpen = true;
        try {
            const { keys, subFolders, nextContinuationToken } = await getFileList(folder.name);
            folder.files = keys;
            folder.subFolders = subFolders.map(subFolder => ({
                name: subFolder,
                subFolders: [],
                files: [],
                isOpen: false,
                nextContinuationToken: null, // Initialize for nested folders
            }));
            folder.nextContinuationToken = nextContinuationToken; // Save the token for loading more files

            setFolders([...folders]);
        } catch (error) {
            console.error("Error loading folder contents:", error);
        }
    };

    const loadMoreFiles = async (folder) => {
        try {
            const { keys, nextContinuationToken } = await getFileList(folder.name, folder.nextContinuationToken);
            folder.files = [...folder.files, ...keys]; // Append new files to the existing array
            folder.nextContinuationToken = nextContinuationToken; // Update the continuation token

            setFolders([...folders]);
        } catch (error) {
            console.error("Error loading more files:", error);
        }
    };

    const handleFolderPreview = async (folderKey) => {
        try {
            const previewData = await getFolderPreview(folderKey);
            setPreviewFolder(previewData);
        } catch (error) {
            console.error("Error fetching folder preview:", error);
        }
    };

    // Start downloading a file
    const handleDownloadStart = async (fileKey) => {
        try {
            const downloadData = await downloadFile(fileKey);
            setDownloadStatus(downloadData);
        } catch (error) {
            console.error("Error starting download:", error);
        }
    };

    // Check download status
    const handleDownloadStatusCheck = async (downloadId) => {
        try {
            const status = await getDownloadStatus(downloadId);
            setDownloadStatus(status);
        } catch (error) {
            console.error("Error checking download status:", error);
        }
    };

    const handleCancelDownload = async (downloadId) => {
        try {
            await cancelDownload(downloadId);
            setDownloadStatus(null);
        } catch (error) {
            console.error("Error canceling download:", error);
        }
    };

    const formatFolderName = (folderPath) => {
        const pathParts = folderPath.split('/').filter(Boolean);
        return pathParts[pathParts.length - 1];
    };

    const renderFolders = (folders) => (
        <ul className="mt-4">
            {folders.map((folder) => (
                <li key={folder.name} className="border-b py-2">
                    <div className="flex justify-between items-center">
                        <span
                            onClick={() => toggleFolder(folder)}
                            className="cursor-pointer text-blue-500"
                        >
                            {formatFolderName(folder.name)}
                        </span>
                        <button onClick={() => handleFolderPreview(folder.name)} className="text-teal-500">
                            Preview Details
                        </button>
                    </div>
                    {folder.isOpen && (
                        <div className="ml-4">
                            {folder.subFolders.length > 0 && renderFolders(folder.subFolders)}
                            <ul>
                                {folder.files.map((file) => (
                                    <li key={file} className="py-2 flex justify-between">
                                        <span>{file}</span>
                                        <button onClick={() => handleDownloadStart(file)} className="text-teal-500">Download</button>
                                    </li>
                                ))}
                            </ul>
                            {folder.nextContinuationToken && (
                                <button onClick={() => loadMoreFiles(folder)} className="bg-teal-500 p-2 text-white rounded-sm mt-2">
                                    Load More
                                </button>
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Folders</h2>
            {renderFolders(folders)}

            {previewFolder && (
                <FolderPreview folderKey={previewFolder} />
            )}

            {downloadStatus && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold">Download Status</h4>
                    <p>Status: {downloadStatus.status}</p>
                    <button onClick={() => handleDownloadStatusCheck(downloadStatus.downloadId)} className="text-teal-500">Refresh Status</button>
                    <button onClick={() => handleCancelDownload(downloadStatus.downloadId)} className="text-red-500 ml-4">Cancel Download</button>
                </div>
            )}
        </div>
    );
};

export default FileList;
