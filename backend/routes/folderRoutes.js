const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { createFolder, listFolders, listFolderContent, deleteFolder, renameFolder } = require("../controllers/folderController");


router.post("/create",requireAuth,createFolder);
router.get("/all",requireAuth,listFolders);
router.post("/rename",requireAuth,renameFolder);
router.delete("/:folder_id",requireAuth,deleteFolder);
router.get("/:folder_id",requireAuth,listFolderContent);

module.exports = router;