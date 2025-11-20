import { useEffect, useState } from "react";
import api from "../utils/api";
import { useFiles } from "../context/FileContext";

export default function RecentFiles() {
    const { loadFolder } = useFiles();
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        fetchRecent();
    }, []);

    const fetchRecent = async () => {
        const res = await api.get("/files/recent");
        setRecent(res.data.files || []);
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-5 w-80 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Recent files uploaded</h2>

            <div className="space-y-3">
                {recent.map((file) => (
                    <div
                        key={file.file_id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        onClick={() => loadFolder(file.folder_id || "root")}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-lg">📄</span>
                            </div>

                            <div>
                                <p className="font-medium">{file.name}</p>
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

                        <div className="text-gray-400">⋮</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
