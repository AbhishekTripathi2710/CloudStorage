import { useFiles } from "../context/FileContext";
import ActionMenu from "./ActionMenu";
import { FiImage, FiFile, FiVideo, FiMusic, FiFileText } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import api from "../utils/api";
import { useNotification } from "../context/NotificationContext";

export default function FileItem({ file }) {
    const { moveFile, renameFile, loadFolder, currentFolder } = useFiles();
    const { showNotification } = useNotification();

    const handleDownload = () => {
        window.open(file.source_link, "_blank");
    };

    const handleRename = async () => {
        const newName = prompt("Enter new name:", file.name);
        if (newName && newName !== file.name) {
            try {
                await renameFile(file.file_id, newName);
                showNotification(`File renamed to "${newName}"`, "success");
            } catch (error) {
                showNotification("Failed to rename file", "error");
            }
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this file? This action cannot be undone.")) return;

        try {
            await api.delete(`/files/${file.file_id}`);
            showNotification(`File "${file.name}" deleted successfully`, "success");
            // Reload the current folder to update the UI
            loadFolder(currentFolder);
        } catch (error) {
            console.error("Failed to delete file:", error);
            showNotification("Failed to delete file. Please try again.", "error");
        }
    };

    const getIcon = () => {
        if (file.file_type.includes("image")) {
            return <FiImage className="w-12 h-12 text-blue-500" />;
        }
        if (file.file_type.includes("pdf")) {
            return <FaFilePdf className="w-12 h-12 text-red-500" />;
        }
        if (file.file_type.includes("video")) {
            return <FiVideo className="w-12 h-12 text-purple-500" />;
        }
        if (file.file_type.includes("audio")) {
            return <FiMusic className="w-12 h-12 text-green-500" />;
        }
        return <FiFileText className="w-12 h-12 text-gray-500" />;
    };

    return (
        <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData("fileId", file.file_id)}
            className="relative bg-white shadow-md hover:shadow-xl border border-gray-100 hover:border-red-200 p-5 rounded-xl flex flex-col items-center cursor-pointer transition-all duration-200 group"
        >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionMenu
                    options={[
                        { label: "Open", onClick: () => window.open(file.source_link) },
                        { label: "Download", onClick: handleDownload },
                        { label: "Rename", onClick: handleRename },
                        { label: "Delete", onClick: handleDelete },
                    ]}
                />
            </div>

            <div className="mb-3 transform group-hover:scale-110 transition-transform flex items-center justify-center">
                {getIcon()}
            </div>

            <p className="text-sm font-medium text-gray-800 truncate text-center w-full px-2">
                {file.name}
            </p>
        </div>
    );
}
