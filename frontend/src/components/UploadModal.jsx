import { useState } from "react";
import { useFiles } from "../context/FileContext";

export default function UploadModal({open, onClose}){
    const {uploadFile, currentFolder} = useFiles();
    const [selectedFile, setSelectedFile] = useState(null);

    if(!open) return null;

    const handleUpload = async () => {
        if(!selectedFile) return alert("Please select a file");

        await uploadFile(selectedFile,currentFolder);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Upload File</h2>

                <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full border p-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}