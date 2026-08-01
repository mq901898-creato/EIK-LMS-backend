const express = require("express");
const router = express.Router();
const {isAdmin} = require("../middleware/role.middleware");
const auth = require ("../middleware/auth.middleware");
const { registerAdmin,
        loginAdmin,
        getAllStudents,
        getAllTeacher,
        deletestudent,
        deleteteacher,
        updatestudent,
        updateteacher,
        admindashboard
                        } = require ("../controllers/admin.controller");
const { updateSearchIndex } = require("../models/user");


router.post("/register", registerAdmin);//Admin register
router.post("/login" , loginAdmin);//admin Login
router.get("/dashboard", auth , isAdmin , admindashboard);//admin Dashboard 
router.get("/getAllstudents", auth , isAdmin, getAllStudents);//get All Students
router.get("/getAllteachers", auth , isAdmin, getAllTeacher);//get All teachers
router.delete("/deleteStudent/:id", auth , isAdmin , deletestudent);//delete Student
router.delete("/deleteTeacher/:id", auth , isAdmin , deleteteacher);//delete Teacher
router.put("/updateStudent/:id" , auth , isAdmin , updatestudent);//update Student 
router.put("/updateTeacher/:id" , auth , isAdmin , updateteacher);//update teacher
router.get("/dashboard" , auth , isAdmin , admindashboard);//admin dashboard




module.exports = router;