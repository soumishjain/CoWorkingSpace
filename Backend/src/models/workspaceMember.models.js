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
    role : {
        type : String,
        enum : ["admin", "member"],
        required : true
    },
    
}, {timestamps : true})

workspaceMemberSchema.index(
    {userId : 1 , workspaceId : 1} ,
    {unique : true}
);

const workspaceMemberModel = mongoose.model("WorkspaceMember" , workspaceMemberSchema)

export default workspaceMemberModel

