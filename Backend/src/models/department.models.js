import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        lowercase: true,
    },
    description : {
        type : String,
        default : ""
    },
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Workspace",
        required : true,
        index : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{timestamps : true})

departmentSchema.index(
    {name : 1 , workspaceId : 1}, 
    {unique : true}
)

const departmentModel = mongoose.model("Department", departmentSchema)

export default departmentModel