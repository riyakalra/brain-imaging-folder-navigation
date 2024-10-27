import React, { useEffect, useState } from 'react';
import { getFileList } from '../services/apiService';

const FileList = ({ onFolderSelect }) => {
    const [files, setFiles] = useState([]);
    const [subFolders, setSubFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            const { keys, subFolders } = await getFileList('');
            setFiles(keys);
            setSubFolders(subFolders);
            setLoading(false);
        };

        fetchFiles();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Files</h2>
            <ul className="mt-4">
                {files.length === 0 ? (
                    <li>No files found.</li>
                ) : (
                    files.map((file) => (
                        <li key={file} className="border-b py-2">{file}</li>
                    ))
                )}
            </ul>
            <h3 className="text-lg font-semibold mt-6">Sub Folders</h3>
            <ul className="mt-4">
                {subFolders.map((folder) => (
                    <li key={folder} className="border-b py-2 cursor-pointer" onClick={() => onFolderSelect(folder)}>
                        {folder}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
