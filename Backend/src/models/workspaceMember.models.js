import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    userId : {
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
    role : {
        type : String,
        enum : ["admin", "manager" , "employee"],
        required : true
    },
    currentMonthPoints : {
        type : Number,
        default : 0
    },
    lifetimePoints : {
        type : Number , 
        default : 0
    }
}, {timestamps : true})

workspaceMemberSchema.index(
    {userId : 1 , workspaceId : 1},
    {unique : true}
);

const workspaceMemberModel = mongoose.model("WorkspaceMember" , workspaceMemberSchema)

export default workspaceMemberModel

