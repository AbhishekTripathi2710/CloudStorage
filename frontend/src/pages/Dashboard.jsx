import { useEffect, useState } from "react";
import { useFiles } from "../context/FileContext";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import FolderItem from "../components/FolderItem";
import FileItem from "../components/FileItem";
import UploadModal from "../components/UploadModal";
import CreateFolderModal from "../components/CreateFolderModal";
import StorageCard from "../components/StorageCard";
import RecentFiles from "../components/recentFiles";

export default function Dashboard() {
    const { folders, files, loadFolder } = useFiles();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    useEffect(() => {
        loadFolder("root");
    }, []);

    return (
        <div className="h-screen flex bg-gray-100">

            <Sidebar />

            <div className="flex-1 p-6 overflow-auto">

                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <SearchBar />
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCreateFolderOpen(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                            + New Folder
                        </button>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Upload
                        </button>
                    </div>
                </div>

                {/* Modals */}
                <UploadModal
                    open={isUploadOpen}
                    onClose={() => setIsUploadOpen(false)}
                />

                <CreateFolderModal
                    open={isCreateFolderOpen}
                    onClose={() => setIsCreateFolderOpen(false)}
                />
                <div className="flex justify-between">
                <StorageCard></StorageCard>
                <RecentFiles></RecentFiles>
                </div>
                {/* Folders */}
                <h2 className="text-xl font-semibold mb-3">Folders</h2>
                <div className="grid grid-cols-6 gap-4 mb-6">
                    {folders.map((f) => (
                        <FolderItem key={f.folder_id} folder={f} />
                    ))}
                </div>

                {/* Files */}
                <h2 className="text-xl font-semibold mb-3">Files</h2>
                <div className="grid grid-cols-6 gap-4">
                    {files.map((file) => (
                        <FileItem key={file.file_id} file={file} />
                    ))}
                </div>

                
            </div>
        </div>
    );
}
