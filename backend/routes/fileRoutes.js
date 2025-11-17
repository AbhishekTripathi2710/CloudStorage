const express = require("express");
const router = express.Router();
const multer = require("multer");
const {cloudinaryStorage, CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { requireAuth } = require("../middleware/authMiddleware");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req,res) => {
        return {
            folder: "cloud_storage_files",
            resource_type: "auto"
        };
    }
});

const upload = multer({storage});

router.post("/upload", requireAuth, );
router.delete("/:file_id",requireAuth,);
router.get("/:folder_id",requireAuth,);

module.exports = router;

