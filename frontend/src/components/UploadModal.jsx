import { useState } from "react";
import { useFiles } from "../context/FileContext";
import { useNotification } from "../context/NotificationContext";

export default function UploadModal({open, onClose}){
    const {uploadFile, currentFolder} = useFiles();
    const { showNotification } = useNotification();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    if(!open) return null;

    const handleUpload = async () => {
        if(!selectedFile) {
            showNotification("Please select a file", "error");
            return;
        }

        try {
            setIsUploading(true);
            await uploadFile(selectedFile, currentFolder);
            showNotification(`File "${selectedFile.name}" uploaded successfully!`, "success");
            setSelectedFile(null);
            onClose();
        } catch (error) {
            showNotification("Failed to upload file. Please try again.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload File</h2>

                <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 p-3 mb-4 rounded-lg outline-none transition-all"
                    disabled={isUploading}
                />

                {selectedFile && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Selected:</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-medium shadow-md transition-all flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}