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
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    taskId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Task",
        required : true,
        index : true
    },
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Workspace",
        required : true,
        index : true
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        required : true,
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
    }
},{timestamps : true})

const subtaskModel = mongoose.model("Subtask",subtaskSchema)

export default subtaskModel