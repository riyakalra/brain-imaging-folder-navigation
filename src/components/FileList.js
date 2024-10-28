import React, { useEffect, useState } from 'react';
import { getFileList, getFolderPreview, downloadFile, getDownloadStatus, cancelDownload, downloadFolder } from '../services/apiService';
import FolderPreview from './FolderPreview';
import { ArrowDownTrayIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const FileList = () => {
    const [folders, setFolders] = useState([]);
    const [previewFolder, setPreviewFolder] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState(null);
    const [previewDataLoading, setPreviewDataLoading] = useState(false);
    const [previewFolderName, setPreviewFolderName] = useState(null);
    const [folderDownloadStatus, setFolderDownloadStatus] = useState(null);
    const [downloadStatusLoading, setDownloadStatusLoading] = useState(false);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const { subFolders } = await getFileList('');
                const initialFolders = subFolders.map(folder => ({
                    name: folder,
                    subFolders: [],
                    files: [],
                    isOpen: false,
                    nextContinuationToken: null,
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
                nextContinuationToken: null,
            }));
            folder.nextContinuationToken = nextContinuationToken;

            setFolders([...folders]);
        } catch (error) {
            console.error("Error loading folder contents:", error);
        }
    };

    const loadMoreFiles = async (folder) => {
        try {
            const { keys, nextContinuationToken } = await getFileList(folder.name, folder.nextContinuationToken);
            folder.files = [...folder.files, ...keys];
            folder.nextContinuationToken = nextContinuationToken;

            setFolders([...folders]);
        } catch (error) {
            console.error("Error loading more files:", error);
        }
    };

    const handleFolderPreview = async (folderKey) => {
        setPreviewDataLoading(true);
        try {
            const previewData = await getFolderPreview(folderKey);
            setPreviewFolder(previewData);
            setPreviewFolderName(folderKey);
            setPreviewDataLoading(false);
        } catch (error) {
            console.error("Error fetching folder preview:", error);
        }
    };

    const handleHidePreview = () => {
        setPreviewFolder(null);
        setPreviewFolderName(null);
    };

    const handleDownloadStart = async (fileKey) => {
        try {
            fileKey = formatFolderName(fileKey);
            const downloadData = await downloadFile(fileKey, false);

            const blob = new Blob([downloadData], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileKey.split('/').pop();
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error("Error starting download:", error);
        }
    };

    const handleDownloadStatusCheck = async (downloadId) => {
        try {
            const status = await getDownloadStatus(downloadId);
            setDownloadStatus(status);
        } catch (error) {
            console.error("Error checking download status:", error);
        }
    };

    const handleCancelDownload = async (downloadId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel the download?");
        if (!confirmCancel) return;

        try {
            setFolderDownloadStatus(null);
            setDownloadStatus(null);
            await cancelDownload(downloadId);
        } catch (error) {
            console.error("Error canceling download:", error);
        }
    };

    const handleFolderDownload = async (folder) => {
        try {
            const zipFileName = `${formatFolderName(folder.name)}.zip`;
            const response = await downloadFolder(folder.name, [], zipFileName);
            setFolderDownloadStatus({ refId: response.ref, status: 'PENDING', zipKey: response.zipFileName });
        } catch (error) {
            console.error("Error starting folder download:", error);
        }
    };

    const checkFolderDownloadStatus = async (refId) => {
        setDownloadStatusLoading(true);
        try {
            const statusData = await getDownloadStatus(refId);
            setFolderDownloadStatus({ ...folderDownloadStatus, status: statusData.status });
            if (statusData.status === 'completed') {
                const downloadLink = document.createElement('a');
                downloadLink.href = statusData.url;
                downloadLink.download = `${folderDownloadStatus.refId}.zip`;
                downloadLink.click();
                setFolderDownloadStatus(null);
            }
            setDownloadStatusLoading(false);
        } catch (error) {
            console.error("Error checking folder download status:", error);
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
                        <div className='flex items-center'>
                            <button
                                onClick={() => previewFolderName === folder.name ? handleHidePreview() : handleFolderPreview(folder.name)}
                                className="text-teal-500 font-semibold flex items-center mr-2 border border-teal-500 px-2 py-1 rounded-md"
                            >
                                {previewFolderName === folder.name ? (
                                    <>
                                        <MinusIcon className="h-4 w-4 mr-1" />
                                        Hide Details
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        Preview Details
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleFolderDownload(folder)}
                                className="flex items-center bg-teal-500 px-2 py-1 text-white rounded-md hover:bg-teal-600 hover:shadow-lg transition duration-150 ease-in-out"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5 text-white font-bold mr-2" />
                                Download
                            </button>
                        </div>
                    </div>

                    {previewFolder && previewFolderName == folder.name && (
                        <FolderPreview data={previewFolder} previewDataLoading={previewDataLoading} />
                    )}
                    {folder.isOpen && (
                        <div className="ml-4">
                            {folder.subFolders.length > 0 && renderFolders(folder.subFolders)}
                            <ul>
                                {folder.files.map((file) => (
                                    <li key={file} className="py-2 flex justify-between items-center">
                                        <span>{file}</span>
                                        <button
                                            onClick={() => handleDownloadStart(file)}
                                            className="flex items-center bg-teal-500 px-2 h-7 py-1 text-white rounded-md hover:bg-teal-600 hover:shadow-lg transition duration-150 ease-in-out"
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5 text-white font-bold mr-2" />
                                            Download
                                        </button>
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

            {folderDownloadStatus && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold">Folder Download Status</h4>
                    <p>Status: {downloadStatusLoading ? 'Loading...' : folderDownloadStatus.status}</p>
                    {folderDownloadStatus.status === 'PENDING' && (
                        <div className='mt-2'>
                            <button
                                onClick={() => checkFolderDownloadStatus(folderDownloadStatus.refId)}
                                className="text-teal-500 border border-teal-500 p-1 rounded-md"
                            >
                                Refresh Status
                            </button>
                            <button
                                onClick={() => handleCancelDownload(folderDownloadStatus.refId)}
                                className="text-red-500 ml-4 p-1 border border-red-500 rounded-md"
                            >
                                Cancel Download
                            </button>
                        </div>
                    )}
                </div>
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
