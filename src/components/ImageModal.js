import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ImageModal = ({ imageUrl, onClose, loading }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    <XMarkIcon className='h-8 w-8'/>
                </button>
                {loading ? `Loading...` : <img src={imageUrl} alt="Preview" className="max-w-full max-h-[80vh] rounded-md" />} 
            </div>
        </div>
    );
};

export default ImageModal;
