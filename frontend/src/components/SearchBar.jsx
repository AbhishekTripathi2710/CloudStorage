import { useState } from "react";
import { useFiles } from "../context/FileContext";
import { FiFile } from "react-icons/fi";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const { searchFiles, loadFolder } = useFiles();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length === 0) {
            setResults([]);
            return;
        }

        const data = await searchFiles(value);
        setResults(data);
    };

    return (
        <div className="relative w-full max-w-xl">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                />
            </div>

            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {results.map((file) => (
                        <div
                            key={file.file_id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            onClick={() => {
                                loadFolder(file.folder_id || "root");
                                setResults([]);
                                setQuery("");
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <FiFile className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-500">Click to open</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
