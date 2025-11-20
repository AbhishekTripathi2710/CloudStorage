import { useEffect, useState } from "react";
import { useFiles } from "../context/FileContext";
import api from "../utils/api";
import { FiFolder, FiImage, FiPlay, FiPieChart } from "react-icons/fi";

function niceBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B","KB","MB","GB","TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function StorageCategoryCards() {
    const { files } = useFiles();
    const [categories, setCategories] = useState({
        documents: { size: 0, count: 0, lastUpdate: null },
        images: { size: 0, count: 0, lastUpdate: null },
        media: { size: 0, count: 0, lastUpdate: null },
        others: { size: 0, count: 0, lastUpdate: null },
    });

    useEffect(() => {
        calculateCategories();
    }, [files]);

    const calculateCategories = () => {
        const newCategories = {
            documents: { size: 0, count: 0, lastUpdate: null },
            images: { size: 0, count: 0, lastUpdate: null },
            media: { size: 0, count: 0, lastUpdate: null },
            others: { size: 0, count: 0, lastUpdate: null },
        };

        files.forEach((file) => {
            const fileType = (file.file_type || "").toLowerCase();
            const fileName = (file.name || "").toLowerCase();
            const fileSize = Number(file.size || 0);
            const uploadDate = file.uploaded_at ? new Date(file.uploaded_at) : null;

            if (fileType.includes("image") || fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
                newCategories.images.size += fileSize;
                newCategories.images.count++;
                if (!newCategories.images.lastUpdate || (uploadDate && uploadDate > newCategories.images.lastUpdate)) {
                    newCategories.images.lastUpdate = uploadDate;
                }
            } else if (fileType.includes("video") || fileType.includes("audio") || fileName.match(/\.(mp4|avi|mov|mp3|wav|flac)$/)) {
                newCategories.media.size += fileSize;
                newCategories.media.count++;
                if (!newCategories.media.lastUpdate || (uploadDate && uploadDate > newCategories.media.lastUpdate)) {
                    newCategories.media.lastUpdate = uploadDate;
                }
            } else if (fileType.includes("pdf") || fileType.includes("document") || fileName.match(/\.(pdf|doc|docx|txt|md)$/)) {
                newCategories.documents.size += fileSize;
                newCategories.documents.count++;
                if (!newCategories.documents.lastUpdate || (uploadDate && uploadDate > newCategories.documents.lastUpdate)) {
                    newCategories.documents.lastUpdate = uploadDate;
                }
            } else {
                newCategories.others.size += fileSize;
                newCategories.others.count++;
                if (!newCategories.others.lastUpdate || (uploadDate && uploadDate > newCategories.others.lastUpdate)) {
                    newCategories.others.lastUpdate = uploadDate;
                }
            }
        });

        setCategories(newCategories);
    };

    const formatDate = (date) => {
        if (!date) return "";
        const now = new Date();
        const fileDate = new Date(date);
        const diffMs = now - fileDate;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffMins < 1440) {
            return `${Math.floor(diffMins / 60)}h ago`;
        } else {
            return fileDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }) + ", " + fileDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
            });
        }
    };

    const categoryData = [
        {
            id: "documents",
            label: "Documents",
            icon: FiFolder,
            iconColor: "text-red-500",
            color: "from-red-500 to-pink-500",
            bgColor: "bg-red-50",
            ...categories.documents,
        },
        {
            id: "images",
            label: "Images",
            icon: FiImage,
            iconColor: "text-blue-500",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            ...categories.images,
        },
        {
            id: "media",
            label: "Media",
            icon: FiPlay,
            iconColor: "text-green-500",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            ...categories.media,
        },
        {
            id: "others",
            label: "Others",
            icon: FiPieChart,
            iconColor: "text-purple-500",
            color: "from-purple-500 to-indigo-500",
            bgColor: "bg-purple-50",
            ...categories.others,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-6">
            {categoryData.map((category) => {
                const IconComponent = category.icon;
                return (
                    <div
                        key={category.id}
                        className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                                <IconComponent className={`w-6 h-6 ${category.iconColor}`} />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">{niceBytes(category.size)}</p>
                                <p className="text-xs text-gray-500">{category.count} files</p>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-1">{category.label}</p>
                            {category.lastUpdate && (
                                <p className="text-xs text-gray-500">
                                    {formatDate(category.lastUpdate)}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

