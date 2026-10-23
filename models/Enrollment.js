const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    }
}, {
    timestamps: true,
});

module.exports = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);