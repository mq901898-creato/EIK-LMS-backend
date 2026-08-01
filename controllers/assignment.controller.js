const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Submission = require("../models/Submission");
const Enrollment = require("../models/Enrollment");

const createAssignment = async (req, res) => {
    try {
        const { title, description, course, dueDate } = req.body;
        const teacher = req.user.id;
        if (!title || !description || !course || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const courseData = await Course.findById(course);
        if (!courseData) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        const assignment = await Assignment.create({
            title,
            description,
            course,
            teacher,
            dueDate
        });
        res.status(201).json({
            success: true,
            message: "Assignment created Successfully",
            assignment
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
};

const getMyAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            teacher: req.user.id
        })
        const count = assignments.length;
        res.status(200).json({
            success: true,
            count,
            assignments
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const getSingleAssignment = async (req, res) => {
    try {
        const id = req.params.id;
        const assignment = await Assignment.findOne({
            _id: id,
            teacher: req.user.id
        });
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            })
        }
        res.status(200).json({
            success: true,
            assignment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const updateAssignment = async (req, res) => {
    try {
        const id = req.params.id;
        const assignment = await Assignment.findOneAndUpdate(
            {
                _id: id,
                teacher: req.user.id
            },
            req.body,
            { new: true }
        );
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Assignment updated Successfully",
            assignment
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const id = req.params.id;
        const assignment = await Assignment.findOneAndDelete({
            _id: id,
            teacher: req.user.id
        });
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Assignment Deleted Successfully",
            assignment
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, submissionURL } = req.body;
        const StudentId = req.user.id;
        if (!assignmentId || !submissionURL) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            })
        }
        const enrollment = await Enrollment.findOne({
            student: StudentId,
            course: assignment.course
        });
        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "you are not enrolled in this course "
            })
        }
        const existingSubmission = await Submission.findOne({
            student: StudentId,
            assignment: assignmentId
        })
        if (existingSubmission) {
            return res.status(409).json({
                success: false,
                message: "You have already submitted this assignment"
            })
        }
        const submission = await Submission.create({
            assignment: assignmentId,
            student: StudentId,
            submissionURL: submissionURL
        })
        res.status(201).json({
            success: true,
            message: "Assignment Submitted",
            submission
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error "
        })
    }
}

const allSubmission = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const submissions = await Submission.find({
            assignment: assignmentId
        }).populate("student");
        const count = submissions.length;
        res.status(200).json({
            success: true,
            message: `Finally ${count} students have submitted the assignment`,
            count,
            submissions
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error "
        })
    }
}

const detail = async (req, res) => {
    try {
        const id = req.params.id;
        const submission = await Submission.findById(id).populate("student", "name email")
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Submission",
            submission
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error "
        })
    }
}
const submissionReviewed = async (req, res) => {
    try {
        const id = req.params.id;
        const { marks, status } = req.body;
        if(marks === undefined || !status){
            return res.status(400).json({
                success : false,
                message : "All feild are required"
        })
        }
        const submission = await Submission.findByIdAndUpdate(
            id,
            {
                marks,status
            },
            {new : true}
        );
        if (!submission) {
            return res.status(404).json({
            success: false,
            message: "Submission not found"
        });
        }
        if (marks < 0 || marks > 100) {
            return res.status(400).json({
                success: false,
                message: "Marks must be between 0 and 100"
            });
        }
        res.status(200).json({
            success: true,
            message: "Submission reviewed successfully",
            submission
        });
    }
    catch (error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error "
        })
    }

}
module.exports = {
    createAssignment,
    getMyAssignments,
    getSingleAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    allSubmission,
    detail,
    submissionReviewed
}