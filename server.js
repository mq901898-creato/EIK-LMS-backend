const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const adminRoutes = require("./routes/admin.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const teacherRoutes = require("./routes/teacher.routes");
const assignmentRoutes = require("./routes/assignment.routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/student", enrollmentRoutes)
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/", assignmentRoutes);


const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT,()=>{
    console.log(`Server is runing On port ${PORT}`);
})
