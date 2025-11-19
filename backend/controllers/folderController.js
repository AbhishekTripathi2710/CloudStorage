const {pool} = require("../db/db");

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

module.exports = {createFolder,listFolderContent,listFolders}