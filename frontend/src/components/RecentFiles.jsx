import { useEffect, useState } from "react";
import api from "../utils/api";
import { useFiles } from "../context/FileContext";
import ActionMenu from "./ActionMenu";
import { FiImage, FiFile, FiVideo, FiMusic, FiFileText, FiCode, FiGlobe } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";

export default function RecentFiles() {
    const { loadFolder, renameFile } = useFiles();
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        fetchRecent();
    }, []);

    const fetchRecent = async () => {
        const res = await api.get("/files/recent");
        setRecent(res.data.files || []);
    };

    const getFileIcon = (fileType, fileName) => {
        if (fileType.includes("image") || fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            return <FiImage className="w-5 h-5 text-blue-500" />;
        }
        if (fileType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf")) {
            return <FaFilePdf className="w-5 h-5 text-red-500" />;
        }
        if (fileType.includes("video") || fileName.toLowerCase().match(/\.(mp4|avi|mov|wmv)$/)) {
            return <FiVideo className="w-5 h-5 text-purple-500" />;
        }
        if (fileType.includes("audio")) {
            return <FiMusic className="w-5 h-5 text-green-500" />;
        }
        if (fileName.toLowerCase().endsWith(".js")) {
            return <FiCode className="w-5 h-5 text-yellow-500" />;
        }
        if (fileName.toLowerCase().endsWith(".html") || fileName.toLowerCase().endsWith(".css")) {
            return <FiGlobe className="w-5 h-5 text-indigo-500" />;
        }
        if (fileName.toLowerCase().endsWith(".txt") || fileName.toLowerCase().endsWith(".md")) {
            return <FiFileText className="w-5 h-5 text-gray-500" />;
        }
        return <FiFile className="w-5 h-5 text-gray-500" />;
    };

    const handleRename = async (file) => {
        const newName = prompt("Enter new name:", file.name);
        if (newName && newName !== file.name) {
            await renameFile(file.file_id, newName);
            fetchRecent(); 
        }
    };

    const handleDelete = async (file) => {
        if (!confirm("Delete this file?")) return;
        try {
            await api.delete(`/files/${file.file_id}`);
            fetchRecent(); 
            window.location.reload();
        } catch (err) {
            console.error("Failed to delete file", err);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-5 flex-1 max-w-md overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent files uploaded</h2>

            <div className="flex-1 overflow-y-auto space-y-2">
                {recent.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No recent files</p>
                    </div>
                ) : (
                    recent.map((file) => (
                        <div
                            key={file.file_id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {getFileIcon(file.file_type || "", file.name)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-800 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(file.uploaded_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })},{" "}
                                        {new Date(file.uploaded_at).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-shrink-0 ml-2">
                                <ActionMenu
                                    options={[
                                        { 
                                            label: "Open", 
                                            onClick: () => window.open(file.source_link, "_blank") 
                                        },
                                        { 
                                            label: "Download", 
                                            onClick: () => window.open(file.source_link, "_blank") 
                                        },
                                        { 
                                            label: "Rename", 
                                            onClick: () => handleRename(file) 
                                        },
                                        { 
                                            label: "Delete", 
                                            onClick: () => handleDelete(file) 
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
