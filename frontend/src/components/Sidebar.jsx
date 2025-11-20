import { useAuth } from "../context/AuthContext";
import { useFiles } from "../context/FileContext";
import { FiLayout, FiFolder, FiImage, FiPlay, FiPieChart, FiFile } from "react-icons/fi";

export default function Sidebar() {
    const { logout, user } = useAuth();
    const { folders, loadFolder, loadFilesByCategory, selectedCategory } = useFiles();

    const navigationItems = [
        { 
            id: "dashboard", 
            label: "Dashboard", 
            icon: FiLayout, 
            action: () => { 
                loadFolder("root"); 
            } 
        },
        { 
            id: "documents", 
            label: "Documents", 
            icon: FiFolder, 
            action: () => loadFilesByCategory("documents") 
        },
        { 
            id: "images", 
            label: "Images", 
            icon: FiImage, 
            action: () => loadFilesByCategory("images") 
        },
        { 
            id: "media", 
            label: "Media", 
            icon: FiPlay, 
            action: () => loadFilesByCategory("media") 
        },
        { 
            id: "others", 
            label: "Others", 
            icon: FiPieChart, 
            action: () => loadFilesByCategory("others") 
        },
    ];

    const activeNav = selectedCategory || "dashboard";

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={item.action}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeNav === item.id
                                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {folders.length > 0 && (
                    <>
                        <div className="border-t border-gray-200 my-4"></div>
                        <h2 className="text-xs uppercase text-gray-500 mb-2 px-4 font-semibold">My Folders</h2>
                        <div className="space-y-1">
                            {folders.map((f) => (
                                <button
                                    key={f.folder_id}
                                    onClick={() => loadFolder(f.folder_id)}
                                    className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center gap-2 transition-colors"
                                >
                                    <FiFolder className="w-4 h-4" />
                                    <span className="text-sm">{f.name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden">
                    <FiFolder className="w-16 h-16 text-blue-400 mb-2" />
                    <div className="text-xs text-gray-600 text-center">
                        <p className="font-medium">Your Files</p>
                        <p className="text-gray-500">Organized & Secure</p>
                    </div>
                    <FiFile className="absolute top-2 right-2 w-6 h-6 text-blue-300 opacity-30" />
                    <FiImage className="absolute bottom-2 left-2 w-6 h-6 text-blue-300 opacity-30" />
                    <FiPlay className="absolute top-1/2 right-1/4 w-5 h-5 text-blue-300 opacity-20" />
                </div>
            </div>

            <div className="p-4 border-t border-gray-200">
                {user && (
                    <div className="mb-3 px-2">
                        <p className="text-sm font-medium text-gray-700">{user.email}</p>
                    </div>
                )}
                <button
                    onClick={logout}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
