import React, { useEffect, useState } from 'react';
import { getFileList, downloadFile, getDownloadStatus, cancelDownload } from '../services/apiService';
import FolderPreview from './FolderPreview';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [subFolders, setSubFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewFolder, setPreviewFolder] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const { keys, subFolders } = await getFileList('');
                setFiles(keys);
                setSubFolders(subFolders);
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const handleDownloadStart = async (fileKey) => {
        try {
            const downloadData = await downloadFile(fileKey);
            setDownloadStatus(downloadData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadStatusCheck = async (downloadId) => {
        try {
            const status = await getDownloadStatus(downloadId);
            setDownloadStatus(status);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancelDownload = async (downloadId) => {
        try {
            await cancelDownload(downloadId);
            setDownloadStatus(null);
        } catch (err) {
            console.error(err);
        }
    };

    const renderSubFolders = (folders) => {
        return (
            <ul className="mt-4">
                {folders.map((folder) => (
                    <li key={folder} className="border-b py-2 flex justify-between">
                        <span>{folder}</span>
                        <button onClick={() => previewFolder ? setPreviewFolder(undefined): setPreviewFolder(folder)} className="text-teal-500">{!previewFolder ? `Preview Details` : `Hide Details`}</button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Files</h2>
            <ul className="mt-4">
                {loading ? (
                    <li>Loading...</li>
                ) : (
                    <>
                        {files.length === 0 && <li>No files found.</li>}
                        {files.map((file) => (
                            <li key={file} className="border-b py-2 flex justify-between">
                                <span>{file}</span>
                                <button onClick={() => handleDownloadStart(file)} className="text-teal-500">Download</button>
                            </li>
                        ))}
                    </>
                )}
            </ul>

            <h3 className="text-lg font-semibold mt-6">Sub Folders</h3>
            {renderSubFolders(subFolders)}

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