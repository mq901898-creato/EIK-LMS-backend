
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { isTeacher, isStudent } = require("../middleware/role.middleware");

const {
  generateQuiz,
  getTeacherQuizzes,
  publishQuiz,
  getAvailableQuizzes,
  getQuizForStudent,
  getTeacherQuiz,
  updateDraftQuiz,
} = require("../controllers/quiz.controller");

const {
  submitQuiz,
  getQuizResult,
} = require("../controllers/quizAttempt.controller");

// Teacher-only endpoints
router.post("/teacher/quizzes/generate", auth, isTeacher, generateQuiz);
router.get("/teacher/quizzes", auth, isTeacher, getTeacherQuizzes);
router.patch(
  "/teacher/quizzes/:id/publish",
  auth,
  isTeacher,
  publishQuiz
);

// Student-only endpoints
router.get("/student/quizzes", auth, isStudent, getAvailableQuizzes);
router.get("/student/quizzes/:id", auth, isStudent, getQuizForStudent);
router.post(
  "/student/quizzes/:id/submit",
  auth,
  isStudent,
  submitQuiz
);
router.get(
  "/student/quizzes/:id/result",
  auth,
  isStudent,
  getQuizResult
);
router.get("/teacher/quizzes/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quiz routes are working!",
  });
});
// Teacher-only: view one quiz for review
router.get(
  "/teacher/quizzes/:id",
  auth,
  isTeacher,
  getTeacherQuiz
);

// Teacher-only: update a draft quiz
router.put(
  "/teacher/quizzes/:id",
  auth,
  isTeacher,
  updateDraftQuiz
);

module.exports = router;
