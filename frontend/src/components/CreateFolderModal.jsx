import { useState } from "react";
import { useFiles } from "../context/FileContext";
import api from "../utils/api";

export default function CreateFolderModal({ open, onClose }) {
    const { currentFolder, loadFolder } = useFiles();
    const [folderName, setFolderName] = useState("");

    if (!open) return null;

    const handleCreate = async () => {
        if (!folderName.trim()) {
            alert("Folder name required");
            return;
        }

        await api.post("/folders/create", {
            name: folderName,
            parent_id: currentFolder === "root" ? null : currentFolder
        });

        onClose();
        setFolderName("");
        loadFolder(currentFolder);
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
            <div className="bg-white p-6 w-96 rounded-xl shadow-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Folder</h2>

                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleCreate();
                        }
                    }}
                    className="w-full border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 p-3 mb-6 rounded-lg outline-none transition-all"
                    autoFocus
                />

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium shadow-md transition-all"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
