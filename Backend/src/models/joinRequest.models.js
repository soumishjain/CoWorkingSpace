import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Workspace",
        default : null
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        default : null
    },
    type : {
        type : String,
        enum : ["workspace" , "department"],
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "approved" , "rejected"],
        default : "pending"
    }
},{timestamps : true})

joinRequestSchema.index(
  { userId: 1, workspaceId: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "workspace" }
  }
);

joinRequestSchema.index(
  { userId: 1, departmentId: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "department" }
  }
);

const joinRequestModel = mongoose.model("JoinRequest",joinRequestSchema)

export default joinRequestModel