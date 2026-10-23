const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("express");

//Adnmin Register
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are missing"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "You Already Exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        })
        res.status(201).json({
            success: true,
            message: "Registered Sucessfully ",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: " Server Error",
        })
    }
};

//Amin Login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is invalid"
            })
        }
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            })
        }
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.status(200).json({
            success: true,
            message: `Thanks ${user.name} for login`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

///GET ALL STUDENTS
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: "student"
        })
        const count = students.length
        res.status(200).json({
            success: true,
            message: "All Students",
            count,
            students,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server Error"
        })
    }
};

//GET ALL TEACHER
const getAllTeacher = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
    });

    res.status(200).json({
      success: true,
      message: "All Teachers",
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
//DELETE STUDENT
const deletestudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await User.findById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student Not Found"
            })
        }
        if (student.role !== "student") {
            return res.status(400).json({
                success: false,
                message: "This user is not a student"
            });
        }
        const deletedStudent = await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Student Deleted Successfully"
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

//DELETE TEACHER
const deleteteacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await User.findById(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "teacher Not Found"
            })
        }
        if (teacher.role !== "teacher") {
            return res.status(400).json({
                success: false,
                message: "This user is not a teacher"
            });
        }
        const deletedTeacher = await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Teacher Deleted Successfully"
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

//UPDATE STUDENT
const updatestudent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            Gender,
            Studentclass,
        } = req.body; const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };
        if (user.role !== "student") {
            return res.status(400).json({
                success: false,
                message: "This user is not a student"
            })
        }
        const student = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phone,
                Gender,
                Studentclass,
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Studnt updated Successfully",
            student
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
};

//UPDATE TEACHER
const updateteacher = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Teacher ID:", id);
        console.log("Request body:", req.body);

        const {
            name,
            email,
            phone,
            Gender,
            subject,
            qualification
        } = req.body;

        const teacher = await User.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        if (teacher.role !== "teacher") {
            return res.status(400).json({
                success: false,
                message: "This user is not a teacher"
            });
        }

        const updatedTeacher = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phone,
                Gender,
                subject,
                qualification
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Teacher updated successfully",
            teacher: updatedTeacher
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
// GET SINGLE COURSE - ADMIN
const getSingleAdminCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id)
            .populate("teacher", "name email");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// GET SINGLE STUDENT
const getSingleStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await User.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        if (student.role !== "student") {
            return res.status(400).json({
                success: false,
                message: "This user is not a student",
            });
        }

        res.status(200).json({
            success: true,
            student,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

//Add teacher
const addTeacher = async (req, res)=>{
    try{
          const {
            name,
            email,
            password,
            phone,
            Gender,
            subject,
            qualification
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
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({
            email
        });
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "Teacher already exists"
            })
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
            role: "teacher"
        });
        res.status(201).json({
            success: true,
            message: "Teacher added successfully",
            teacher
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
// GET ALL COURSES - ADMIN
const getAllAdminCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("teacher", "name email");

        res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            count: courses.length,
            courses,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
const admindashboard = async (req, res) => {
    try {
        const students = await User.countDocuments({
            role: "student"
        })
        const teachers = await User.countDocuments({
            role: "teacher"
        });
        const courses = await Course.countDocuments();
        const assignments = await Assignment.countDocuments();
        const enrollments = await Enrollment.countDocuments();
        const submissions = await Submission.countDocuments();
        res.status(200).json({
            success: true,
            message: "Admin Dashboard",
            data: {
                students,
                teachers,
                courses,
                assignments,
                enrollments,
                submissions
            }
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
//delete course
const deleteCourse = async(req , res)=>{
  try{
    const {id} = req.params;
      const course = await Course.findByIdAndDelete(id)
       if(!course){
        return res.status(404).json({
          success:false,
          message :"Course not found"
        });
      }
       res.status(200).json({
        success: true,
        message:"Course deleted successfully"
      })
      return 200;
  }catch(error){
    res.status(500).json({
      success : false ,
      message : "Server Error"
    })
    
  }
}

const updateAdminCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            price,
            thumbnail,
            isPublished
        } = req.body;

        const course = await Course.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                price,
                thumbnail,
                isPublished
            },
            { new: true }
        ).populate("teacher", "name email");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail } = req.body;

    if (!title || !description || !category) {
    return res.status(400).json({
        success: false,
        message: "All required fields are missing",
    });
    }

    // Create the course
     const course = await Course.create({
        title,
        description,
        category,
        price,
        thumbnail,
        teacher: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getsingleTeacher = async (req, res)=>{
    try{
        const {id} = req.params;
        const teacher = await User.findById(id);
        if(!teacher){
            return res.status(404).json({
                success : false,
                "message" :"Teache not found"
            })
        }
        if (teacher.role !== "teacher") {
            return res.status(400).json({
                success: false,
                message: "This user is not a teacher",
            });
        }
        res.status(200).json({
            success :true,
            teacher
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}
// GET ALL ASSIGNMENTS - ADMIN
const getAllAdminAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("course", "title category")
            .populate("teacher", "name email");

        res.status(200).json({
            success: true,
            message: "All assignments fetched successfully",
            count: assignments.length,
            assignments,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// DELETE ASSIGNMENT - ADMIN
const deleteAdminAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        await Assignment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// GET SINGLE ASSIGNMENT - ADMIN
const getSingleAdminAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment.findById(id)
            .populate("course", "title category")
            .populate("teacher", "name email");

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Assignment fetched successfully",
            assignment,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// UPDATE ASSIGNMENT - ADMIN
const updateAdminAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            course,
            dueDate,
        } = req.body;

        // Check assignment exists
        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        // Validate required fields
        if (!title || !description || !course || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check course exists
        const courseData = await Course.findById(course);

        if (!courseData) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Update assignment
        const updatedAssignment =
            await Assignment.findByIdAndUpdate(
                id,
                {
                    title,
                    description,
                    course,
                    dueDate,
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            .populate("course", "title category")
            .populate("teacher", "name email");

        res.status(200).json({
            success: true,
            message: "Assignment updated successfully",
            assignment: updatedAssignment,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// GET ADMIN PROFILE
const getAdminProfile = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id)
            .select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        res.status(200).json({
            success: true,
            admin,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// UPDATE ADMIN PROFILE
const updateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        const admin = await User.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        // Prevent duplicate email
        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user.id },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already in use",
            });
        }

        const updatedAdmin = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            admin: updatedAdmin,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// CHANGE ADMIN PASSWORD
const changeAdminPassword = async (req, res) => {
    try {
        console.log("========== CHANGE PASSWORD ==========");
        console.log("REQ.USER:", req.user);
        console.log("REQ.BODY:", req.body);

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

        // Check JWT user ID
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User ID is missing from token",
            });
        }

        console.log("Finding admin:", req.user.id);

        const admin = await User.findById(req.user.id);

        console.log("ADMIN:", admin);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        console.log("ADMIN ROLE:", admin.role);
        console.log("PASSWORD EXISTS:", !!admin.password);

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        if (!admin.password) {
            return res.status(500).json({
                success: false,
                message: "Admin password is missing in database",
            });
        }

        console.log("Comparing passwords...");

        const isMatch = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        console.log("PASSWORD MATCH:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        console.log("Hashing new password...");

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        admin.password = hashedPassword;

        console.log("Saving admin...");

        await admin.save();

        console.log("PASSWORD UPDATED SUCCESSFULLY");

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("========== PASSWORD ERROR ==========");
        console.error(error);
        console.error("MESSAGE:", error.message);
        console.error("STACK:", error.stack);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// GET ALL ENROLLMENTS - ADMIN
// ======================================================

const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name email")
            .populate("course", "title category")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All enrollment requests fetched successfully",
            count: enrollments.length,
            enrollments,
        });

    } catch (error) {
        console.error("GET ALL ENROLLMENTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// ======================================================
// APPROVE ENROLLMENT - ADMIN
// ======================================================

const approveEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findById(id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment request not found",
            });
        }

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
        console.error("ADMIN APPROVE ENROLLMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// ======================================================
// REJECT ENROLLMENT - ADMIN
// ======================================================

const rejectEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findById(id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment request not found",
            });
        }

        if (enrollment.status === "Rejected") {
            return res.status(400).json({
                success: false,
                message: "Enrollment is already rejected",
            });
        }

        enrollment.status = "Rejected";

        await enrollment.save();

        return res.status(200).json({
            success: true,
            message: "Enrollment rejected successfully",
            enrollment,
        });

    } catch (error) {
        console.error("ADMIN REJECT ENROLLMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


module.exports = {
    registerAdmin,
    loginAdmin,
    getAllStudents,
    getAllTeacher,
    deletestudent,
    deleteteacher,
    updatestudent,
    updateteacher,
    admindashboard,
    getSingleStudent,
    addTeacher,
    getsingleTeacher,
    getAllAdminCourses,
    deleteCourse,
    getSingleAdminCourse,
    updateAdminCourse,
    createCourse,
    getAllAdminAssignments,
    deleteAdminAssignment,
    getSingleAdminAssignment,
    updateAdminAssignment,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    getAllEnrollments,
    approveEnrollment,
    rejectEnrollment
}