const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");

const registerTeacher = async (req , res) =>{
    try{
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success : false,
                message : "All feilds are missing"
            })
        }
        const existingTeacher = await User.findOne({ email });
        if(existingTeacher){
            return res.status(409).json({
                success : false,
                message : "you alredy exist "
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await User.create({
            name,
            email ,
            password : hashedPassword,
            role : "teacher"
        })

        res.status(201).json({
            success : true ,
            message : "Registered Sucessfully",
            teacher :{
                id : teacher._id,
                name : teacher.name ,
                email : teacher.email,
                role : teacher.role
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : " Server Error",
        })
    }
}

//login Teacher
const loginTeacher = async (req , res) =>{
    try{
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All feilds are messing"
        })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success : false,
                message : 'User not found',
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success : false,
                message : "Password is invalid"
            })
        }

        if(user.role !== "teacher"){
            return res.status(403).json({
                success : false,
                message : "Access denied"
            })
        }
    
        const token = jwt.sign(
            {
                id : user._id,
                role : user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        )

        res.status(200).json({
            success : true ,
            message : `Thanks ${user.name} for login`,
            token,
            user: {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
            },
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}


///get EnrolledStudents 
const getEnrolledStudents = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const courseId = req.params.courseId; 
        const course = await Course.findOne({
            _id : courseId,
            teacher : teacherId,
        })
        if(!course){
            return res.status(404).json({
                success : false,
                message: "Course not found or you are not authorized to access it"  
            })
        }
        const enrollments = await Enrollment.find({
            course: courseId
        }).populate("student", "name email");
        const students = enrollments.map(enrollment => enrollment.student);

        res.status(200).json({
            success: true,
            students
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

const teacherDashboard = async (req , res)=>{
    try{
        const courses = await Course.countDocuments({
            teacher : req.user.id
        })
        const teacherAssignments = await Assignment.find({
            teacher: req.user.id
        });
        const assignmentIds = teacherAssignments.map(
            assignment => assignment._id
        );
        const submissions = await Submission.countDocuments({
            assignment :{
                $in : assignmentIds
            }
        })
        const pending = await Submission.countDocuments({
            assignment: {
                $in: assignmentIds
            },
            status: "Pending"
        });
        const reviewed = await Submission.countDocuments({
            assignment: {
                $in: assignmentIds
            },
            status: "Reviewed"
        });
        res.status(200).json({
            success: true,
            message: "Teacher Dashboard",
            data: {
                courses,
                assignments: teacherAssignments.length,
                submissions,
                pending,
                reviewed
    }
});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

module.exports= {
            getEnrolledStudents,///get EnrolledStudents 
            registerTeacher,//register Teacher
            loginTeacher,//login Teacer
            teacherDashboard,//Teacher Dashboard
}