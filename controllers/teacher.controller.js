const jwt = require("jsonwebtoken");
const Course = require("../models/course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");


// ======================================================
// REGISTER TEACHER
// ======================================================

const registerTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      Gender,
      subject,
      qualification,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !Gender ||
      !subject ||
      !qualification
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingTeacher = await User.findOne({ email });

    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Teacher already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      Gender,
      subject,
      qualification,
      role: "teacher",
    });

    return res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      teacher,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// LOGIN TEACHER
// ======================================================

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is invalid",
      });
    }

    if (user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: `Thanks ${user.name} for login`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// GET ENROLLED STUDENTS
// ======================================================

const getEnrolledStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courseId = req.params.courseId;

    const course = await Course.findOne({
      _id: courseId,
      teacher: teacherId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found or you are not authorized to access it",
      });
    }

    const enrollments = await Enrollment.find({
      course: courseId,
    }).populate("student", "name email");

    const students = enrollments.map(
      (enrollment) => enrollment.student
    );

    return res.status(200).json({
      success: true,
      students,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// CREATE COURSE
// ======================================================

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      thumbnail,
      isPublished,
    } = req.body;

    // Required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and category are required",
      });
    }

    // Make sure logged-in user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail: thumbnail || "",
      isPublished: isPublished || false,

      // Automatically assign logged-in teacher
      teacher: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });

  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// ======================================================
// GET TEACHER COURSES
// ======================================================

const getAllCourses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const courses = await Course.find({
      teacher: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });

  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// ======================================================
// TEACHER DASHBOARD
// ======================================================

const teacherDashboard = async (req, res) => {
  try {
    const courses = await Course.countDocuments({
      teacher: req.user.id,
    });

    const teacherAssignments = await Assignment.find({
      teacher: req.user.id,
    });

    const assignmentIds = teacherAssignments.map(
      (assignment) => assignment._id
    );

    const submissions = await Submission.countDocuments({
      assignment: {
        $in: assignmentIds,
      },
    });

    const pending = await Submission.countDocuments({
      assignment: {
        $in: assignmentIds,
      },
      status: "Pending",
    });

    const reviewed = await Submission.countDocuments({
      assignment: {
        $in: assignmentIds,
      },
      status: "Reviewed",
    });

    return res.status(200).json({
      success: true,
      message: "Teacher Dashboard",

      data: {
        courses,
        assignments: teacherAssignments.length,
        submissions,
        pending,
        reviewed,
      },
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getTeacherSubmissions = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const submissions = await Submission.find()
      .populate({
        path: "assignment",
        populate: {
          path: "course",
          match: {
            teacher: teacherId,
          },
        },
      })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    // Only submissions belonging to this teacher's courses
    const teacherSubmissions = submissions.filter(
      (submission) => submission.assignment?.course
    );

    res.status(200).json({
      success: true,
      submissions: teacherSubmissions,
    });
  } catch (error) {
    console.error("Get teacher submissions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
};

// ======================================================
// GET ENROLLMENT REQUESTS - TEACHER
// ======================================================

const getTeacherEnrollments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Find teacher's courses
    const courses = await Course.find({
      teacher: teacherId,
    }).select("_id title");

    const courseIds = courses.map((course) => course._id);

    // Find enrollment requests for teacher's courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email")
      .populate("course", "title category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Enrollment requests fetched successfully",
      enrollments,
    });

  } catch (error) {
    console.error("GET TEACHER ENROLLMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const approveEnrollment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;

    console.log("================================");
    console.log("TEACHER ID:", teacherId);
    console.log("ENROLLMENT ID:", id);

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment request not found",
      });
    }

    console.log("ENROLLMENT STUDENT:", enrollment.student);
    console.log("ENROLLMENT COURSE:", enrollment.course);

    const course = await Course.findById(enrollment.course);

    console.log("COURSE FOUND:", course);
    console.log("COURSE TEACHER:", course?.teacher);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher.toString() !== teacherId.toString()) {
      console.log("❌ TEACHER ID DOES NOT MATCH");
      console.log("Course Teacher:", course.teacher.toString());
      console.log("Logged-in Teacher:", teacherId.toString());

      return res.status(403).json({
        success: false,
        message: "You are not authorized to approve this enrollment",
      });
    }

    console.log("✅ TEACHER MATCHED");

    if (enrollment.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Enrollment is already approved",
      });
    }

    enrollment.status = "Approved";

    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Enrollment approved successfully",
      enrollment,
    });

  } catch (error) {
    console.error("APPROVE ENROLLMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// REJECT ENROLLMENT - TEACHER
// ======================================================

const rejectEnrollment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;

    // Find enrollment
    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment request not found",
      });
    }

    // Check that this course belongs to this teacher
    const course = await Course.findOne({
      _id: enrollment.course,
      teacher: teacherId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this enrollment",
      });
    }

    // Check current status
    if (enrollment.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Enrollment is already rejected",
      });
    }

    // Reject
    enrollment.status = "Rejected";
    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Enrollment rejected successfully",
      enrollment,
    });

  } catch (error) {
    console.error("REJECT ENROLLMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  registerTeacher,
  loginTeacher,
  getEnrolledStudents,
  createCourse,
  getAllCourses,
  teacherDashboard,
  getTeacherSubmissions,
  getTeacherEnrollments,
  approveEnrollment,
  rejectEnrollment
};