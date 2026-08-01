const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

//enroll in course 
const enrollCourse = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.params;

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId
        });

        res.status(201).json({
            success: true,
            message: "Enrolled Successfully",
            enrollment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Get all enrolled courses
const getMyCourses = async (req, res) => {
    try {
        const studentId = req.user.id;

        const enrollments = await Enrollment.find({
            student: studentId
        }).populate("course");

        res.status(200).json({
            success: true,
            enrollments,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = { 
            enrollCourse,//enroll in course 
            getMyCourses,//get all enrolled courses
        };    