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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Create Folder</h2>

                <input
                    type="text"
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="w-full border p-2 mb-4 rounded"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
