import { useFiles } from "../context/FileContext"

export default function FolderItem({folder}){
    const {loadFolder} = useFiles();

    return(
        <div
            onClick={() => loadFolder(folder.folder_id)}
            className="cursor-pointer bg-white shadow-sm hover:shadow-md p-4 rounded-lg flex flex-col items-center"
        >
            <div className="text-4xl">📁</div>
            <p className="mt-2 text-sm font-medium">{folder.name}</p>
        </div>
    )
}