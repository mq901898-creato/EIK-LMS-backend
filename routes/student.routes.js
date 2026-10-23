const express = require("express");
const router = express.Router();

// 1. Ensure all middlewares are correctly imported
const auth = require("../middleware/auth.middleware"); // (or verifyToken if that's what your file is named)
const { isStudent } = require("../middleware/role.middleware");

// 2. Ensure all controllers are imported properly
const { 
    registerStudent,
    loginStudent, 
    getMyCourses,
    myAssignments,
    mySubmission,
    studentDashboard,

} = require("../controllers/student.controller");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/Courses/:id", auth, isStudent, getMyCourses);
router.get("/Assignments/:id", auth, isStudent, myAssignments);
router.get("/submissions/:id", auth, isStudent, mySubmission);
router.get('/dashboard', auth, isStudent, studentDashboard);



module.exports = router;