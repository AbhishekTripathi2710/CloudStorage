import { useState } from "react";
import { useFiles } from "../context/FileContext";

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
        <div className="relative w-80">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search files..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />

            {results.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg border z-50">
                    {results.map((file) => (
                        <div
                            key={file.file_id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                loadFolder(file.folder_id || "root");
                                setResults([]);
                                setQuery("");
                            }}
                        >
                            {file.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
