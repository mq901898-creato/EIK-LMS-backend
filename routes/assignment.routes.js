const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { isTeacher , isStudent } = require("../middleware/role.middleware");
const {createAssignment,
        getMyAssignments,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        allSubmission,
        detail,
        submissionReviewed }=require("../controllers/assignment.controller");

router.post("/createAssignment", auth, isTeacher, createAssignment);
router.get("/getAllAssignment/:id", auth , isTeacher, getMyAssignments);
router.put("/updateAssignment/:id", auth , isTeacher, updateAssignment);
router.delete("/deleteAssignment/:id", auth , isTeacher, deleteAssignment);
router.post("/submit", auth , isStudent , submitAssignment);
router.get("/allsubmission/:id", auth , isTeacher , allSubmission);
router.get("/detail/:id", auth , isTeacher , detail);
router.post("/reviewed/:id", auth , isTeacher , submissionReviewed);

module.exports = router;