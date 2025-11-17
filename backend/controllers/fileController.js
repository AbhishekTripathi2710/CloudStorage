const { pool } = require("../db/db");
const cloudinary = require("../config/cloudinary");

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

async function uploadFile(req, res) {
    const user_id = req.user.user_id;
    const { folder_id } = req.body;

    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });

    try {
        const fileName = req.file.originalname;
        const size = req.file.size;
        const fileType = req.file.mimetype;

        const cloudUrl = req.file.path;

        const [result] = await pool.query(
            `INSERT INTO files (user_id, folder_id, name, file_type, source_link, size)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, folder_id || null, fileName, fileType, cloudUrl, size]
        );

        await pool.query(
            "UPDATE users SET storage_used = storage_used + ? WHERE user_id = ?",
            [size, user_id]
        );

        return res.status(201).json({
            file_id: result.insertId,
            name: fileName,
            url: cloudUrl,
            size,
            folder_id: folder_id || null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" });
    }
}

async function listFiles(req, res) {
    const user_id = req.user.user_id;
    const { folder_id } = req.params;

    try {
        const [files] = await pool.query(
            "SELECT * FROM files WHERE user_id = ? AND folder_id = ?",
            [user_id, folder_id]
        );

        return res.json(files);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

async function deleteFile(req, res) {
    const user_id = req.user.user_id;
    const { file_id } = req.params;

    try {
        const [rows] = await pool.query(
            "SELECT source_link, size FROM files WHERE file_id = ? AND user_id = ?",
            [file_id, user_id]
        );

        if (!rows.length) return res.status(404).json({ error: "File not found" });

        const file = rows[0];

        const publicId = extractPublicId(file.source_link);
        if (!publicId) {
            return res.status(500).json({ error: "Invalid Cloudinary public_id" });
        }

        await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw"
        });

        await pool.query("DELETE FROM files WHERE file_id = ?", [file_id]);

        await pool.query(
            "UPDATE users SET storage_used = storage_used - ? WHERE user_id = ?",
            [file.size, user_id]
        );

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Delete failed" });
    }
}

module.exports = { uploadFile, listFiles, deleteFile };
