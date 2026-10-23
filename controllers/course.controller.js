const Course = require("../models/course");

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

// Get all available courses for students
const getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("teacher", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Available courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("GET AVAILABLE COURSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// get course by id of teacher
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({
        teacher: req.user.id,
    });
        res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            courses,
        })
    } catch (error){
        res.status(500).json({
            success: false,
            message :"Server Error"
        })
    }
}

// get single course 
const getSingleCourse = async (req , res)=>{
  try{
    const {id} = req.params;
    const course = await Course.findOne({
      _id : id,
      teacher : req.user.id
    });
    if(!course){
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "fethched single course sucessfully",
      course,
    })
  }catch(error){
    res.status(500).json({
      success: false,
      message : "Server Error"
    })
  }
}

//delete course
const deleteCourse = async(req , res)=>{
  try{
    const {id} = req.params;
      const course = await Course.findOneAndDelete({
        _id : id,
        teacher : req.user.id
      })
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

  //update course
  const updateCourse = async(req , res)=>{
    try{
      const {id }= req.params;
      const course = await Course.findOneAndUpdate(
      { 
        _id : id,
        teacher : req.user.id
      },
        req.body,
       { new : true}
      );
      if(!course){
        return res.status(404).json({
          sucess: false,
          message :"Course not Found"
        })
      }
      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course
    });
    }catch(error){
      res.status(500).json({
        success : false,
        message : "Server Error"
      })
    }
  }

module.exports = {
  createCourse,//create course
  getAllCourses,//get all courses by teacher id
  getAvailableCourses,//get all available courses for students
  getSingleCourse,//get single course 
  deleteCourse,//delete course
  updateCourse,//update course
};