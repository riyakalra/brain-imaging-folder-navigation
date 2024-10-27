import React, { useState } from 'react';
import FileList from './components/FileList';
import FolderPreview from './components/FolderPreview';

const App = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);

    const handleFolderSelect = (folderKey) => {
        setSelectedFolder(folderKey);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-teal-600 text-white p-4">
                <h1 className="text-2xl">Brain Imaging</h1>
            </header>
            <main className="p-4">
                {!selectedFolder ? (
                    <FileList onFolderSelect={handleFolderSelect} />
                ) : (
                    <FolderPreview folderKey={selectedFolder} />
                )}
            </main>
        </div>
    );
};

export default App;