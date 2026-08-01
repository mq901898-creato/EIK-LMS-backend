const User = require("../models/user");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Assignmnent = require("../models/Assignment");
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
    // //Admin Dashboard
    // const admindashboard = async (req, res) => {
    //     try {
    //         const totalStudent = await User.countDocuments({
    //             role: "student"
    //         })
    //         const totalTeachers = await User.countDocuments({
    //             role: "teacher"
    //         })
    //         const totalCourses = await Course.countDocuments();
    //         const totalEnrollment = await Enrollment.countDocuments();
    //         res.status(200).json({
    //             success: true,
    //             message: "Admin Dashboard",
    //             dashboard: {
    //                 totalStudents: totalStudent,
    //                 totalTeachers: totalTeachers,
    //                 totalCourses: totalCourses,
    //                 totalEnrollments: totalEnrollment
    //             }
    //         })
    //     }
    //     catch (error) {
    //         console.log(error);
    //         return res.status(500).json({
    //             success: false,
    //             message: "Server Error"
    //         })
    //     }
    // };

///GET ALL STUDENTS
const getAllStudents = async (req ,res)=>{
    try{
        const students = await User.find({
            role : "student"
        })
        const count = students.length
        res.status(200).json({
            success : true,
            message : "All Students",
            count,
            students,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "server Error"
        })
    }
};

//GET ALL TEACHER
const getAllTeacher = async (req ,res)=>{
    try{
        const teacher = await User.find({
            role : "teacher"
        })
        const count = teacher.length
        res.status(200).json({
            success : true,
            message : "All Teacher",
            count,
            teacher,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "server Error"
        })
    }
};

//DELETE STUDENT
const deletestudent = async (req , res)=>{
    try {
        const {id} = req.params;
        const student = await User.findById(id);
        if(!student){
            return res.status(404).json({
                success : false,
                message : "Student Not Found"
            })
        }
        if (student.role !== "student") {
        return res.status(400).json({
        success: false,
        message: "This user is not a student"
            });
        }
        res.status(200).json({
            success : true ,
            message : "Student Deleted Successfully"    
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

//DELETE TEACHER
const deleteteacher = async (req , res)=>{
    try {
        const {id} = req.params;
        const teacher = await User.findById(id);
        if(!teacher){
            return res.status(404).json({
                success : false,
                message : "teacher Not Found"
            })
        }
        if (teacher.role !== "teacher") {
        return res.status(400).json({
            success: false,
            message: "This user is not a teacher"
        });
}
        res.status(200).json({
            success : true ,
            message : "Teacher Deleted Successfully"
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

//UPDATE STUDENT
const updatestudent = async (req , res)=>{
    try{
        const {id} = req.params;
        const {name , email} = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })            
        };
        if(user.role !== "student"){
            return res.status(400).json({
            success: false,
            message: "This user is not a student"
            })
        }
        const student = await User.findByIdAndUpdate(
            id,
            { name , email},
            {new  : true}
            )
            res.status(200).json({
                success : true,
                message : "Studnt updated Successfully",
                student
            });
    }
    catch(error){
        console.log(error)
        res.status(500).json({
        success : false,
        message : "Server Error"
      })
    }
};

//UPDATE TEACHER
const updateteacher = async (req , res)=>{
    try{
        const {id} = req.params;
        const {name , email} = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })            
        };
        if(user.role !== "teacher"){
            return res.status(400).json({
            success: false,
            message: "This user is not a teacher"
            })
        }
        const teacher = await User.findByIdAndUpdate(
            id,
            { name , email},
            {new  : true}
            )
            res.status(200).json({
                success : true,
                message : "teacher updated Successfully",
                teacher
            });
    }
    catch(error){
        console.log(error)
        res.status(500).json({
        success : false,
        message : "Server Error"
      })
    }
};

const admindashboard = async (req, res)=>{
    try{
        const students = await User.countDocuments({
            role : "student"
        })
        const teachers = await User.countDocuments();
        const courses = await User.countDocuments();
        const assignments = await Assignmnent.countDocuments();
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
    catch(error){
        console.log(error)
        res.status(500).json({
        success : false,
        message : "Server Error"
      })
    }
}
    module.exports = {
        registerAdmin,
        loginAdmin,
        getAllStudents,
        getAllTeacher,
        deletestudent,
        deleteteacher,
        updatestudent,
        updateteacher,
        admindashboard
    }