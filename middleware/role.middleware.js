const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Teacher only.",
    });
  }

  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student only.",
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isTeacher,
  isStudent,
};