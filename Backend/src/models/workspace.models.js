import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        default : ""
    },
    coverImage : {
        type : String,
        default : "https://i.pinimg.com/1200x/92/46/50/924650bbe679764dcb8c0d7fa386e76c.jpg"
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    joinPassword : {
        type : String,
        required : true,
        select : false,
        minlength : 6
    }
},{
    timestamps : true
})

const workspaceModel = mongoose.model("Workspace", workspaceSchema)

export default workspaceModel
