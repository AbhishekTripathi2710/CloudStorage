import { useAuth } from "../context/AuthContext";
import { useFiles } from "../context/FileContext";

export default function Sidebar() {
    const { logout } = useAuth();
    const { folders, loadFolder } = useFiles();

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col p-4 border-r border-gray-800">

            <h1 className="text-2xl font-bold mb-6">CloudStorage</h1>

            <div className="space-y-2">
                <button
                    onClick={() => loadFolder("root")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                     My Files
                </button>

                <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                     Recent
                </button>

                <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                    🗑 Trash
                </button>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            <div className="flex-1 overflow-y-auto">
                <h2 className="text-sm uppercase text-gray-400 mb-2">Folders</h2>

                <div className="space-y-1">
                    {folders.length === 0 && (
                        <p className="text-gray-500 text-sm">No folders created</p>
                    )}

                    {folders.map((f) => (
                        <button
                            key={f.folder_id}
                            onClick={() => loadFolder(f.folder_id)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800"
                        >
                             {f.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={logout}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg"
            >
                Logout
            </button>
        </div>
    );
}
