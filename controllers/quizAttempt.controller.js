
const mongoose = require("mongoose");

const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Enrollment = require("../models/Enrollment");

const submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const answers = req.body.answers;

    if (!mongoose.isValidObjectId(quizId) || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz or answers.",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      status: "published",
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    const enrolled = await Enrollment.exists({
      student: req.user.id,
      course: quiz.course,
      status: "Approved",
    });

    if (!enrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    const existingAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user.id,
    });

    if (existingAttempt) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this quiz.",
      });
    }

    // Only accept answers for real questions in this quiz.
    const submittedMap = new Map();

    for (const answer of answers) {
      if (
        !answer ||
        !mongoose.isValidObjectId(answer.questionId) ||
        !Number.isInteger(answer.selectedAnswer) ||
        answer.selectedAnswer < 0 ||
        answer.selectedAnswer > 3 ||
        submittedMap.has(String(answer.questionId))
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more answers are invalid.",
        });
      }

      submittedMap.set(
        String(answer.questionId),
        answer.selectedAnswer
      );
    }

    const gradedAnswers = quiz.questions.map((question) => {
      const selectedAnswer = submittedMap.get(String(question._id));
      const isCorrect = selectedAnswer === question.correctAnswer;

      return {
        questionId: question._id,
        selectedAnswer:
          selectedAnswer === undefined ? null : selectedAnswer,
        isCorrect,
      };
    });

    // A missing answer is marked wrong.
    const score = gradedAnswers.filter(
      (answer) => answer.isCorrect
    ).length;

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user.id,
      answers: gradedAnswers,
      score,
      totalQuestions: quiz.questions.length,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted and graded successfully.",
      result: {
        attemptId: attempt._id,
        score,
        totalQuestions: quiz.questions.length,
        percentage: Math.round(
          (score / quiz.questions.length) * 100
        ),
      },
    });
  } catch (error) {
    // A duplicate-index conflict means an attempt already exists.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this quiz.",
      });
    }

    console.error("SUBMIT QUIZ ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not submit quiz.",
    });
  }
};

const getQuizResult = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      quiz: req.params.id,
      student: req.user.id,
    }).populate("quiz", "title topic");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz result not found.",
      });
    }

    return res.json({
      success: true,
      result: {
        quiz: attempt.quiz,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: Math.round(
          (attempt.score / attempt.totalQuestions) * 100
        ),
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    console.error("GET QUIZ RESULT ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load quiz result.",
    });
  }
};

module.exports = {
  submitQuiz,
  getQuizResult,
};
