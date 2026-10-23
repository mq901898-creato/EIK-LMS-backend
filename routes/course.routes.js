const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { isTeacher , isAdmin , isStudent} = require("../middleware/role.middleware");

const {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
    getAvailableCourses
} = require("../controllers/course.controller");

router.post("/course", auth, isTeacher, createCourse);//create  course
router.get("/courses", auth, isTeacher, getAllCourses);//get all courses

router.get("/course/:id", auth, isTeacher, getSingleCourse);//get single course
router.delete("/delete/:id",auth , isTeacher, deleteCourse);//delete course
router.put("/update/:id",auth , isTeacher , updateCourse);//update course
router.get("/student/courses", auth, isStudent, getAvailableCourses);

module.exports = router;