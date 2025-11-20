import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [currentFolder, setCurrentFolder] = useState("root");
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [storage,setStorage] = useState({allocated: 0, used: 0});

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
                storage
            }}
        >
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => useContext(FileContext);
