const express = require("express");
const router = express.Router();
const { enrollCourse , getMyCourses } = require("../controllers/enrollment.controller");
const auth = require("../middleware/auth.middleware");
const { isStudent } = require("../middleware/role.middleware");

router.post("/enroll/:courseId", auth, isStudent, enrollCourse);
router.get("/my-courses", auth, isStudent, getMyCourses);

module.exports = router;