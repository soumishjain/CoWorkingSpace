import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
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
    status : {
        type : String,
        enum : ["pending", "approved" , "rejected"],
        default : "pending"
    }
},{timestamps : true})

joinRequestSchema.index(
    {userId : 1 , workspaceId : 1}, {unique : true}
)

const joinRequestModel = mongoose.model("JoinRequest",joinRequestSchema)

export default joinRequestModel