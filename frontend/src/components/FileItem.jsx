export default function FileItem({ file }) {
    const getIcon = () => {
        if (file.file_type.includes("image")) return "🖼️";
        if (file.file_type.includes("pdf")) return "📕";
        if (file.file_type.includes("video")) return "🎥";
        if (file.file_type.includes("audio")) return "🎵";
        return "📄";
    };

    return (
        <div className="bg-white shadow-sm hover:shadow-md p-4 rounded-lg flex flex-col items-center">
            <div className="text-4xl">{getIcon()}</div>

            <p className="mt-2 text-sm text-center truncate w-full">
                {file.name}
            </p>

            <a
                href={file.source_link}
                target="_blank"
                className="text-blue-600 underline text-xs mt-1"
            >
                Open
            </a>
        </div>
    );
}
