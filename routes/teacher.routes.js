const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { isTeacher } = require("../middleware/role.middleware");
const {getEnrolledStudents, registerTeacher , loginTeacher, teacherDashboard} = require ("../controllers/teacher.controller");

router.post("/register" , registerTeacher);// Register teacher
router.post("/login" , loginTeacher);// login Teacher
router.get("/course/:courseId/student", auth , isTeacher , getEnrolledStudents);//get enrolled students by teacer
router.get("/dashboard" , auth , isTeacher , teacherDashboard);

module.exports = router;