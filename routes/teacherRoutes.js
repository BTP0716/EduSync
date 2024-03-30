const express = require("express");
const {
  getTeacherInfoController,
  updateProfileController,
  getTeacherByIdController,
} = require("../controllers/teacherCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/getTeacherInfo", authMiddleware, getTeacherInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);


router.post("/getTeacherById", authMiddleware, getTeacherByIdController);

module.exports = router;
