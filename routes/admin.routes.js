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
        admindashboard,
        getSingleStudent,
        addTeacher,
        getsingleTeacher,
        getAllAdminCourses,
        deleteCourse,
        getSingleAdminCourse,
        updateAdminCourse,
        createCourse,
        getAllAdminAssignments,
        deleteAdminAssignment,
        getSingleAdminAssignment,
        updateAdminAssignment,
        getAdminProfile,
        updateAdminProfile,
        changeAdminPassword,
        getAllEnrollments,
        approveEnrollment,
        rejectEnrollment
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
router.get("/getSingleStudent/:id", auth, isAdmin, getSingleStudent); // Get a single student by ID 
router.post("/addTeacher", auth, isAdmin, addTeacher); // Add a new teacher
router.get("/getAllCourses" , auth , isAdmin , getAllAdminCourses);//all admin courses
router.get("/getSingleTeacher/:id",auth,isAdmin,getsingleTeacher ); // Get a single teacher by ID
router.delete("/deleteCourse/:id" , auth , isAdmin , deleteCourse);//delete course
router.get("/getSingleCourse/:id",auth,isAdmin,getSingleAdminCourse);//get single course 
router.put("/updateCourse/:id",auth,isAdmin,updateAdminCourse);//update course 
router.post("/addCourse", auth , isAdmin , createCourse);//create Course
router.get("/getAllAssignments", auth , isAdmin , getAllAdminAssignments);//get all assighments for admin
router.delete("/assighmentdelete/:id", auth , isAdmin , deleteAdminAssignment);//delete admin assiighment  
router.get("/getSingleAssignment/:id",auth,isAdmin,getSingleAdminAssignment);//get single Assighment to update 
router.put("/updateAssignment/:id", auth , isAdmin , updateAdminAssignment);//update Assighment to admin Side
router.get("/profile",auth,isAdmin,getAdminProfile);//Admin Profile 
router.put("/profile",auth,isAdmin,updateAdminProfile);//update Admin profile
router.put("/changePassword",auth,isAdmin,changeAdminPassword);// change admin password setting
router.get("/enrollments",auth,isAdmin,getAllEnrollments);
router.put("/enrollments/:id/approve",auth,isAdmin,approveEnrollment);
router.put("/enrollments/:id/reject",auth,isAdmin,rejectEnrollment);

module.exports = router;