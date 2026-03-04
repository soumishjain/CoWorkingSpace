import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        default : ""
    },
    taskId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Task",
        required : true,
        index : true
    },
    assignedTo: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null,
        index : true
    },
    points : {
        type : Number,
        required : true
    },
    deadline : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "completed"],
        default : "pending"
    },
    completedAt : {
        type : Date
    },
    completedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

subtaskSchema.index({assignedTo : 1 , status : 1});

const subtaskModel = mongoose.model("Subtask",subtaskSchema)

export default subtaskModel