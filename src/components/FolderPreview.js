import React, { useEffect, useState } from 'react';
import { getFolderPreview } from '../services/apiService';

const FolderPreview = ({ folderKey }) => {
    const [folderData, setFolderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFolderPreview = async () => {
            const data = await getFolderPreview(folderKey);
            setFolderData(data);
            setLoading(false);
        };

        fetchFolderPreview();
    }, [folderKey]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!folderData) {
        return <div>No data found.</div>;
    }

    const { lastModified, nextContinuationToken, totalFiles, totalSize } = folderData;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Folder Details Preview</h2>
            <p><strong>Last Modified:</strong> {new Date(lastModified).toLocaleString()}</p>
            <p><strong>Total Files:</strong> {totalFiles}</p>
            <p><strong>Total Size:</strong> {(totalSize / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
    );
};

export default FolderPreview;
