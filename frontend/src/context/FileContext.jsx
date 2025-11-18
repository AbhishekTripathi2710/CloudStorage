import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [currentFolder, setCurrentFolder] = useState("root");
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);

    const loadFolder = async (folderId = "root") => {
        setCurrentFolder(folderId);

        const folderRes = await api.get(`/folders/${folderId}`);
        const fileRes = await api.get(`/files/${folderId}`);

        setFolders(folderRes.data.folders || []);

        setFiles(fileRes.data || []);
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
                searchFiles
            }}
        >
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => useContext(FileContext);
