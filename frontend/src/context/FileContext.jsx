import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [currentFolder, setCurrentFolder] = useState("root");
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [storage,setStorage] = useState({allocated: 0, used: 0});
    const [selectedCategory, setSelectedCategory] = useState(null);

    const loadStorage = async () => {
        try{
            const res = await api.get("/files/storage");
            setStorage({
                allocated: res.data.storage_allocated,
                used: res.data.storage_used
            });
        }catch(err){
            console.error("localStorage error",err);
        }
    }

    const loadFolder = async (folderId = "root") => {
        setCurrentFolder(folderId);
        setSelectedCategory(null);

        try {
            await loadStorage();
            const folderRes = await api.get(`/folders/${folderId}`);
            const fileRes = await api.get(`/files/${folderId}`);

            setFolders(folderRes.data.folders || []);
            setFiles(fileRes.data || []);
        } catch (err) {
            console.error("Failed to load folder", err);
            setFolders([]);
            setFiles([]);
        }
    };

    const uploadFile = async (file, folderId = currentFolder) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_id", folderId);

        await api.post("/files/upload", formData);
        await loadFolder(folderId);
    };

    const moveFile = async (fileId, targetFolder) => {
        await api.post("/files/move", {
            file_id: fileId,
            target_folder_id: targetFolder,
        });
        await loadFolder(currentFolder);
    };

    const renameFile = async (fileId, newName) => {
        await api.post("/files/rename", {
            file_id: fileId,
            new_name: newName,
        });
        await loadFolder(currentFolder);
    };

    const searchFiles = async (query) => {
        const res = await api.get(`/files/search?query=${query}`);
        return res.data.files || [];
    };

    const loadFilesByCategory = async (category) => {
        setSelectedCategory(category);
        setCurrentFolder("root");
        setFolders([]);

        try {
            await loadStorage();
            
            const res = await api.get("/files/search?query=");
            const allFilesData = res.data.files || [];
            
            let filteredFiles = [];
            
            if (category === "documents") {
                filteredFiles = allFilesData.filter((file) => {
                    const fileType = (file.file_type || "").toLowerCase();
                    const fileName = (file.name || "").toLowerCase();
                    return fileType.includes("pdf") || fileType.includes("document") || fileName.match(/\.(pdf|doc|docx|txt|md|rtf|odt)$/);
                });
            } else if (category === "images") {
                filteredFiles = allFilesData.filter((file) => {
                    const fileType = (file.file_type || "").toLowerCase();
                    const fileName = (file.name || "").toLowerCase();
                    return fileType.includes("image") || fileName.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/);
                });
            } else if (category === "media") {
                filteredFiles = allFilesData.filter((file) => {
                    const fileType = (file.file_type || "").toLowerCase();
                    const fileName = (file.name || "").toLowerCase();
                    return fileType.includes("video") || fileType.includes("audio") || fileName.match(/\.(mp4|avi|mov|wmv|flv|mkv|mp3|wav|flac|aac|ogg|m4a)$/);
                });
            } else if (category === "others") {
                filteredFiles = allFilesData.filter((file) => {
                    const fileType = (file.file_type || "").toLowerCase();
                    const fileName = (file.name || "").toLowerCase();
                    
                    const isImage = fileType.includes("image") || fileName.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/);
                    const isMedia = fileType.includes("video") || fileType.includes("audio") || fileName.match(/\.(mp4|avi|mov|wmv|flv|mkv|mp3|wav|flac|aac|ogg|m4a)$/);
                    const isDocument = fileType.includes("pdf") || fileType.includes("document") || fileName.match(/\.(pdf|doc|docx|txt|md|rtf|odt)$/);
                    
                    return !isImage && !isMedia && !isDocument;
                });
            }
            
            setFiles(filteredFiles);
        } catch (err) {
            console.error("Failed to load files by category", err);
            setFiles([]);
        }
    };

    return (
        <FileContext.Provider
            value={{
                currentFolder,
                files,
                folders,
                loadFolder,
                uploadFile,
                moveFile,
                renameFile,
                searchFiles,
                storage,
                selectedCategory,
                setSelectedCategory,
                loadFilesByCategory
            }}
        >
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => useContext(FileContext);
