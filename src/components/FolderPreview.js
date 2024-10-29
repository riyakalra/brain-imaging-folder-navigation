import React from 'react';

const FolderPreview = ({ data, previewDataLoading }) => {

    if (previewDataLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No data found.</div>;
    }

    return (
        <div className="p-4 mt-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Folder Details Preview</h2>
            <p><strong>Last Modified:</strong> {new Date(data.lastModified).toLocaleString()}</p>
            <p><strong>Total Files:</strong> {data.totalFiles}</p>
            <p><strong>Total Size:</strong> {(data.totalSize / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
    );
};

export default FolderPreview;
