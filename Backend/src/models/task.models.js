import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        default : ""
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
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
    priority : {
        type : String,
        enum : ["low" , "medium" , "high"],
        required : true
    },
    totalPoints : {
        type : Number,
        required : true
    },
    deadline : {
        type : Date,
        required : true
    },
    progress : {
        type : Number,
        default : 0,
        min : 0,
        max : 100
    },
    status : {
        type : String,
        enum : ["pending", "in-progress" , "awaiting-approval" , "completed"],
        default : "pending"
    },
    approvalFeedback : {
        type : String,
        default : ""
    },
    approvedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    approvedAt : {
        type : Date
    }
},{timestamps : true})

const taskModel = mongoose.model("Task",taskSchema)

export default taskModel