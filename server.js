
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables before importing database config
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

app.get("/", (req, res) => {
  res.send("EIK LMS Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/student", enrollmentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/", assignmentRoutes);

const PORT = process.env.PORT || 5000;


async function startServer() {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EIK LMS server running on port ${PORT}`);

    connectDB().catch((error) => {
      console.error("Database startup error:", error.message);
    });
  });
}

startServer();

