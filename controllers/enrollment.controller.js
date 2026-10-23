
const Enrollment = require("../models/Enrollment");
const Course = require("../models/course");

// ==========================================
// Student → Request Enrollment
// Only ONE Pending or Approved course at a time
// ==========================================
const enrollCourse = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.params;

        // 1. Check if the requested course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // 2. Check whether the student already has an active enrollment
        const activeEnrollment = await Enrollment.findOne({
            student: studentId,
            status: { $in: ["Pending", "Approved"] }
        }).populate("course", "title");

        if (activeEnrollment) {
            const activeCourseName =
                activeEnrollment.course?.title || "another course";

            return res.status(409).json({
                success: false,
                message:
                    activeEnrollment.status === "Pending"
                        ? `Your request for "${activeCourseName}" is pending. You cannot request another course until it is rejected.`
                        : `You are already enrolled in "${activeCourseName}". You cannot request another course while this enrollment is active.`,
                enrollment: activeEnrollment
            });
        }

        // 3. Check if this student previously requested this course
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        // 4. If the previous request was rejected, allow another request
        if (existingEnrollment) {
            if (existingEnrollment.status === "Rejected") {
                existingEnrollment.status = "Pending";
                await existingEnrollment.save();

                return res.status(200).json({
                    success: true,
                    message: "Enrollment request sent again successfully",
                    enrollment: existingEnrollment
                });
            }

            return res.status(409).json({
                success: false,
                message: `An enrollment request already exists with status: ${existingEnrollment.status}`
            });
        }

        // 5. Create a new enrollment request
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            status: "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Enrollment request sent successfully",
            enrollment
        });

    } catch (error) {
        console.error("ENROLL COURSE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// ==========================================
// Student → Get My Enrollment Requests
// ==========================================
const getMyCourses = async (req, res) => {
    try {
        const studentId = req.user.id;

        const enrollments = await Enrollment.find({
            student: studentId
        })
            .populate(
                "course",
                "title description thumbnail category price teacher"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            enrollments
        });

    } catch (error) {
        console.error("GET MY COURSES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


module.exports = {
    enrollCourse,
    getMyCourses
};
