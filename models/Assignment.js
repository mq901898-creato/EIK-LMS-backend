const mongoose = require("mongoose");

const AssighmentSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    course :{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Course"
    },
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    dueDate : {
        type : Date,
        required : true 
    },
},
     {
        timestamps : true
    }
)

module.exports = mongoose.model("Assignment", AssighmentSchema);