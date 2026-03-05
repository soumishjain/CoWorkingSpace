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
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null,
        index : true
    },
    claimedAt : {
        type : Date,
        default : null
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
        type : Date,
        default : null
    },
    completedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default :null
    }
},{timestamps : true})

subtaskSchema.index({assignedTo : 1 , status : 1});
subtaskSchema.index({taskId: 1 , status : 1})

const subtaskModel = mongoose.model("Subtask",subtaskSchema)

export default subtaskModel