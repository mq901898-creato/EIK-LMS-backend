const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { isTeacher , isStudent } = require("../middleware/role.middleware");
const {createAssignment,
        getMyAssignments,
        updateAssignment,
        deleteAssignment,
        // submitAssignment,
        allSubmission,
        detail,
        getStudentAssignments,
        getStudentAssignmentDetail,
        submitAssignment ,
        submissionReviewed }=require("../controllers/assignment.controller");

router.post("/createAssignment", auth, isTeacher, createAssignment);
router.get("/getAllAssignment/:id", auth , isTeacher, getMyAssignments);
router.put("/updateAssignment/:id", auth , isTeacher, updateAssignment);
router.delete("/deleteAssignment/:id", auth , isTeacher, deleteAssignment);
// router.post("/submit", auth , isStudent , submitAssignment);
router.get("/allsubmission/:id", auth , isTeacher , allSubmission);
router.get("/detail/:id", auth , isTeacher , detail);
router.post("/reviewed/:id", auth , isTeacher , submissionReviewed);
// Student Assignment Routes (Make sure 'auth' is used instead of undefined 'verifyToken')
router.get("/student/assignments", auth, isStudent, getStudentAssignments);
router.get("/student/assignments/:id", auth, isStudent, getStudentAssignmentDetail);
router.post("/student/assignments/submit", auth, isStudent, submitAssignment);

module.exports = router;