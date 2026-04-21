import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique: true
    },
    description : {
        type : String,
        default : ""
    },
    coverImage : {
        type : String,
        default : "https://i.pinimg.com/736x/08/00/c1/0800c1a670b7e070d55bef3b1bfb4b57.jpg"
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    plan: {
        type: String,
        enum: ["individual", "startup", "company", "bigtech"],
        default: "individual"
    },

    memberCount: {
        type: Number,
        default: 1
    },

    departmentCount: {
        type: Number,
        default: 1
    },

    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription"
    }
},{
    timestamps : true
})

const workspaceModel = mongoose.model("Workspace", workspaceSchema)

export default workspaceModel
