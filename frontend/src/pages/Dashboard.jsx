import { useEffect, useState } from "react";
import { useFiles } from "../context/FileContext";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import FolderItem from "../components/FolderItem";
import FileItem from "../components/FileItem";
import UploadModal from "../components/UploadModal";
import CreateFolderModal from "../components/CreateFolderModal";
import StorageCard from "../components/StorageCard";
import RecentFiles from "../components/RecentFiles";
import StorageCategoryCards from "../components/StorageCategoryCards";
import { FiFolder, FiImage, FiPlay, FiPieChart } from "react-icons/fi";

export default function Dashboard() {
    const { folders, files, loadFolder, selectedCategory } = useFiles();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    useEffect(() => {
        loadFolder("root");
    }, []); 

    return (
        <div className="h-screen flex bg-gray-50">

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">CloudStore</h1>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8">
                        <SearchBar />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateFolderOpen(true)}
                            className="bg-white border-2 border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-600 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Folder
                        </button>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="flex gap-6 mb-6">
                        <StorageCard />
                        <RecentFiles />
                        <StorageCategoryCards />
                    </div>

                    {selectedCategory && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2 flex items-center gap-3">
                                {selectedCategory === "documents" && <FiFolder className="w-6 h-6 text-red-500" />} 
                                {selectedCategory === "images" && <FiImage className="w-6 h-6 text-blue-500" />} 
                                {selectedCategory === "media" && <FiPlay className="w-6 h-6 text-purple-500" />} 
                                {selectedCategory === "others" && <FiPieChart className="w-6 h-6 text-indigo-500" />} 
                                {selectedCategory}
                            </h2>
                            <p className="text-gray-500">
                                {files.length === 0 
                                    ? "No files in this category" 
                                    : `${files.length} file${files.length !== 1 ? "s" : ""} found`
                                }
                            </p>
                        </div>
                    )}

                    {!selectedCategory && folders.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold mb-4 mt-6 text-gray-800">Folders</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                                {folders.map((f) => (
                                    <FolderItem key={f.folder_id} folder={f} />
                                ))}
                            </div>
                        </>
                    )}

                    {files.length > 0 && (
                        <>
                            {!selectedCategory && (
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Files</h2>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {files.map((file) => (
                                    <FileItem key={file.file_id} file={file} />
                                ))}
                            </div>
                        </>
                    )}

                    {folders.length === 0 && files.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-lg mb-2">
                                {selectedCategory 
                                    ? `No ${selectedCategory} found` 
                                    : "No files or folders yet"
                                }
                            </p>
                            <p className="text-sm">
                                {selectedCategory 
                                    ? "Try uploading files of this type" 
                                    : "Upload a file or create a folder to get started"
                                }
                            </p>
                        </div>
                    )}
                </div>

                <UploadModal
                    open={isUploadOpen}
                    onClose={() => setIsUploadOpen(false)}
                />

                <CreateFolderModal
                    open={isCreateFolderOpen}
                    onClose={() => setIsCreateFolderOpen(false)}
                />
            </div>
        </div>
    );
}
