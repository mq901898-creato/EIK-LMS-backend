
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const adminRoutes = require("./routes/admin.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const teacherRoutes = require("./routes/teacher.routes");
const assignmentRoutes = require("./routes/assignment.routes");

const app = express();

app.use(express.json());
app.use(cors());

// Health check: test whether the backend is responding
app.get("/", (req, res) => {
  res.status(200).send("EIK LMS Backend is running!");
});

// Connect to MongoDB before processing API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
    });
  }
});

// Existing LMS routes
app.use("/api/auth", authRoutes);
app.use("/api/student", enrollmentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/", assignmentRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`EIK LMS server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}

module.exports = app;