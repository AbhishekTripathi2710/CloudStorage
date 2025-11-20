const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { requireAuth } = require("../middleware/authMiddleware");
const {
    uploadFile,
    deleteFile,
    listFiles,
    moveFile,
    renameFile,
    searchFiles,
    getStorage,
    recentFiles
} = require("../controllers/fileController");

const normaliseExtension = (file) => {
    const extFromName = path.extname(file.originalname || "").slice(1).toLowerCase();
    if (extFromName) return extFromName;

    const mimeSegment = (file.mimetype || "").split("/").pop();
    return mimeSegment || undefined;
};

const sanitiseName = (file) => {
    const baseName = path.parse(file.originalname || "").name || "file";
    return baseName.replace(/[^\w\-]+/g, "_");
};

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const format = normaliseExtension(file);
        const publicId = `${Date.now()}_${sanitiseName(file)}`;

        return {
            folder: "cloud_storage_files",
            resource_type: "raw",
            type: "upload",
            public_id: publicId,
            ...(format && { format })
        };
    }
});

const upload = multer({ storage });

router.get("/search", requireAuth, searchFiles)
router.get("/storage",requireAuth,getStorage);
router.get("/recent",requireAuth, recentFiles)
router.post("/upload", requireAuth, upload.single("file"), uploadFile);
router.delete("/:file_id", requireAuth, deleteFile);
router.post("/move",requireAuth,moveFile);
router.post("/rename",requireAuth,renameFile)
router.get("/:folder_id", requireAuth, listFiles);

module.exports = router;
