import { useFiles } from "../context/FileContext";
import ActionMenu from "./ActionMenu";
import { FiFolder } from "react-icons/fi";
import api from "../utils/api";
import { useNotification } from "../context/NotificationContext";

export default function FolderItem({ folder }) {
    const { loadFolder, currentFolder } = useFiles();
    const { showNotification } = useNotification();

    const handleRename = async () => {
        const newName = prompt("Enter new folder name:", folder.name);
        if (!newName || newName === folder.name) return;

        try {
            await api.post("/folders/rename", {
                folder_id: folder.folder_id,
                new_name: newName
            });
            showNotification(`Folder renamed to "${newName}"`, "success");
            // Reload the current folder to update the UI
            loadFolder(currentFolder);
        } catch (error) {
            console.error("Failed to rename folder:", error);
            showNotification("Failed to rename folder. Please try again.", "error");
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete folder "${folder.name}"? This will also delete all files inside. This action cannot be undone.`)) return;

        try {
            await api.delete(`/folders/${folder.folder_id}`);
            showNotification(`Folder "${folder.name}" deleted successfully`, "success");
            // Reload the current folder to update the UI
            loadFolder(currentFolder);
        } catch (error) {
            console.error("Failed to delete folder:", error);
            const errorMessage = error.response?.data?.error || "Failed to delete folder. Please try again.";
            showNotification(errorMessage, "error");
        }
    };

    return (
        <div
            className="relative bg-white shadow-md hover:shadow-xl border border-gray-100 hover:border-red-200 p-5 rounded-xl flex flex-col items-center cursor-pointer transition-all duration-200 group"
            onClick={() => loadFolder(folder.folder_id)}
        >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionMenu
                    options={[
                        { label: "Open", onClick: () => loadFolder(folder.folder_id) },
                        { label: "Rename", onClick: handleRename },
                        { label: "Delete", onClick: handleDelete },
                    ]}
                />
            </div>

            <div className="mb-3 transform group-hover:scale-110 transition-transform flex items-center justify-center">
                <FiFolder className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="text-sm font-medium text-gray-800 truncate text-center w-full px-2">{folder.name}</p>
        </div>
    );
}
