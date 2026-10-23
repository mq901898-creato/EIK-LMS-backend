const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { isTeacher } = require("../middleware/role.middleware");

const {
  registerTeacher,
  loginTeacher,
  teacherDashboard,
  getAllCourses,
  createCourse,
  getEnrolledStudents,
  getTeacherSubmissions,

  // Enrollment
  getTeacherEnrollments,
  approveEnrollment,
  rejectEnrollment
} = require("../controllers/teacher.controller");


// Teacher Authentication
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);


// Teacher Dashboard
router.get(
  "/dashboard",
  auth,
  isTeacher,
  teacherDashboard
);


// Teacher Courses
router.get(
  "/courses",
  auth,
  isTeacher,
  getAllCourses
);

router.post(
  "/courses",
  auth,
  isTeacher,
  createCourse
);


// Teacher Students
router.get(
  "/students/:courseId",
  auth,
  isTeacher,
  getEnrolledStudents
);


// Teacher Submissions
router.get(
  "/submissions",
  auth,
  isTeacher,
  getTeacherSubmissions
);


// ==========================================
// ENROLLMENT REQUESTS
// ==========================================

router.get(
  "/enrollments",
  auth,
  isTeacher,
  getTeacherEnrollments
);

router.put(
  "/enrollments/:id/approve",
  auth,
  isTeacher,
  approveEnrollment
);

router.put(
  "/enrollments/:id/reject",
  auth,
  isTeacher,
  rejectEnrollment
);


module.exports = router;

