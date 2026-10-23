const User = require("../models/User");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

///Register Student
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, phone,Gender, role } = (req.body);
        if (!name || !email || !password || !phone || !Gender || !role) {
            return res.status(400).json({
                success: false,
                message: "required feild is empty"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: " User already exists"
            })
        }
        const hashedPassword = await bycrpt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            Gender,
            role
        });

        res.status(201).json({
            success: true,
            message: "Student Register Successfully",
            user,
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }
}

// Login Student
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are requried"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await bycrpt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
        if (user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
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

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user.id
        }).populate("course");
        const count = enrollments.length;
        res.status(200).json({
            success: true,
            message: "All enrollments",
            count,
            enrollments
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const myAssignments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user.id
        });
        const courseIds = enrollments.map(enrollments => enrollments.course);
        const assignments = await Assignment.find({
            course: {
                $in: courseIds
            }
        }).populate("course", "title , category")
        const count = assignments.length;
        res.status(200).json({
            success: true,
            message: "All Assignments",
            count,
            assignments
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const mySubmission = async (req, res) => {
    try {
        const submissions = await Submission.find({
            student: req.user.id
        }).populate("assignment", "title description");
        const count = submissions.length;
        res.status(200).json({
            success: true,
            message: "All Submissions",
            count,
            submissions
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const studentDashboard = async (req, res) => {
    try {
        const courses = await Enrollment.countDocuments({
            student: req.user.id
        });
        const enrollment = await Enrollment.find({
            student: req.user.id
        })
        const courseIds = enrollment.map(enrollment => enrollment.course);
        const assignments = await Assignment.countDocuments({
            course: {
                $in: courseIds
            }
        });
        const submitted = await Submission.countDocuments({
            student: req.user.id
        })
        const pending = await Submission.countDocuments({
            student: req.user.id,
            status: "Pending"
        })
        const reviewed = await Submission.countDocuments({
            student: req.user.id,
            status: "Reviewed"
        })
        res.status(200).json({
            success: true,
            message: "Student Dashboard",
            data: {
                courses,
                assignments,
                submitted,
                pending,
                reviewed
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
module.exports = {
    registerStudent,
    loginStudent,
    getMyCourses,
    myAssignments,
    mySubmission,
    studentDashboard
}