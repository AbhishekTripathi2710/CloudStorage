const {pool} = require("../db/db");
const cloudinary = require("../config/cloudinary");

async function createFolder(req,res){
    const user_id = req.user.user_id;
    const {name, parent_id} = req.body;

    if(!name) return res.status(400).json({error: "Folder name is required"});

    try{
        if(parent_id){
            const [p] = await pool.query(
                "SELECT folder_id FROM folders WHERE folder_id = ? AND user_id = ?",
                [parent_id,user_id]
            );

            if(!p.length) return res.status(404).json({error: "Parent folder not found"});
        }

        const [result] = await pool.query(
            "INSERT INTO folders (user_id, name, parent_id) VALUES (?, ?, ?)",
            [user_id,name,parent_id || null] 
        );

        return res.status(201).json({
            folder_id: result.insertId,
            name,
            parent_id: parent_id || null
        });
    } catch(err){
        console.error(err);
        return res.status(500).json({error: "Server error"});
    }
}

async function listFolders(req, res) {
    const user_id = req.user.user_id;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM folders WHERE user_id = ?",
            [user_id]
        );

        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

async function listFolderContent(req,res){
    const user_id = req.user.user_id;
    const rawFolderId = req.params.folder_id;
    const folder_id = rawFolderId === "root" ? null : rawFolderId;

    try{
        const folderQuery = folder_id === null
            ? "SELECT * FROM folders WHERE parent_id IS NULL AND user_id = ?"
            : "SELECT * FROM folders WHERE parent_id = ? AND user_id = ?";
        const folderParams = folder_id === null ? [user_id] : [folder_id,user_id];

        const filesQuery = folder_id === null
            ? "SELECT * FROM files WHERE folder_id IS NULL AND user_id = ?"
            : "SELECT * FROM files WHERE folder_id = ? AND user_id = ?";
        const fileParams = folder_id === null ? [user_id] : [folder_id,user_id];

        const [folders] = await pool.query(folderQuery, folderParams);
        const [files] = await pool.query(filesQuery, fileParams);

        return res.json({folders,files});
    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Server error"});
    }
}

const extractPublicId = (cloudinaryUrl) => {
    try {
        const { pathname } = new URL(cloudinaryUrl);
        const segments = pathname.split("/").filter(Boolean);
        const uploadIndex = segments.indexOf("upload");
        if (uploadIndex === -1) return null;

        const remainder = segments.slice(uploadIndex + 1);
        if (remainder[0] && /^v\d+$/.test(remainder[0])) remainder.shift();
        if (!remainder.length) return null;

        const lastSegment = remainder.pop() || "";
        const lastWithoutExt = lastSegment.replace(/\.[^/.]+$/, "");
        remainder.push(lastWithoutExt);

        return remainder.join("/");
    } catch (error) {
        console.error("Failed to extract Cloudinary public_id:", error);
        return null;
    }
};

async function deleteFolder(req, res) {
    const user_id = req.user.user_id;
    const { folder_id } = req.params;

    try {
        const [folderRows] = await pool.query(
            "SELECT folder_id FROM folders WHERE folder_id = ? AND user_id = ?",
            [folder_id, user_id]
        );

        if (!folderRows.length) {
            return res.status(404).json({ error: "Folder not found" });
        }

        const [subfolders] = await pool.query(
            "SELECT folder_id FROM folders WHERE parent_id = ? AND user_id = ?",
            [folder_id, user_id]
        );

        if (subfolders.length > 0) {
            return res.status(400).json({ error: "Cannot delete folder with subfolders. Please delete subfolders first." });
        }

        const [files] = await pool.query(
            "SELECT file_id, source_link, size FROM files WHERE folder_id = ? AND user_id = ?",
            [folder_id, user_id]
        );

        let totalSize = 0;
        for (const file of files) {
            try {
                const publicId = extractPublicId(file.source_link);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, {
                        resource_type: "raw"
                    });
                }
            } catch (cloudinaryError) {
                console.error(`Failed to delete file from Cloudinary: ${file.file_id}`, cloudinaryError);
            }
            totalSize += Number(file.size || 0);
        }

        if (files.length > 0) {
            await pool.query(
                "DELETE FROM files WHERE folder_id = ? AND user_id = ?",
                [folder_id, user_id]
            );
        }

        await pool.query(
            "DELETE FROM folders WHERE folder_id = ? AND user_id = ?",
            [folder_id, user_id]
        );

        if (totalSize > 0) {
            await pool.query(
                "UPDATE users SET storage_used = storage_used - ? WHERE user_id = ?",
                [totalSize, user_id]
            );
        }

        return res.json({ success: true, message: "Folder deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete folder" });
    }
}

async function renameFolder(req, res) {
    const user_id = req.user.user_id;
    const { folder_id, new_name } = req.body;

    if (!new_name || !new_name.trim()) {
        return res.status(400).json({ error: "Folder name is required" });
    }

    try {
        const [folderRows] = await pool.query(
            "SELECT folder_id FROM folders WHERE folder_id = ? AND user_id = ?",
            [folder_id, user_id]
        );

        if (!folderRows.length) {
            return res.status(404).json({ error: "Folder not found" });
        }

        await pool.query(
            "UPDATE folders SET name = ? WHERE folder_id = ? AND user_id = ?",
            [new_name.trim(), folder_id, user_id]
        );

        return res.json({ success: true, message: "Folder renamed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to rename folder" });
    }
}

module.exports = {createFolder,listFolderContent,listFolders,deleteFolder,renameFolder}