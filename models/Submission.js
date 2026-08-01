const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    assignment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Assignment"
    },
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    submissionURL :{
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Pending" , "Reviewed" ],
        default : "Pending"
    },
    marks : {
        type : Number,
        default : 0
    }
},
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Submission", SubmissionSchema);