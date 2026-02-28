import mongoose from "mongoose";

const monthlyLeaderboardSchema = new mongoose.Schema({
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Workspace",
        required : true,
        index : true,
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        required : true,
        index : true,
    },
    month : {
        type : String,
        required : true
    },  
    rankings : [
        {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        points : {
            type : Number,
            required : true
        },
        rank : {
            type : Number,
            required : true
        }
    }
    ]
},{timestamps : true})

monthlyLeaderboardSchema.index(
    {workspaceId : 1 , departmentId : 1 , month : 1} , {unique : true}
)

const monthlyLeaderboardModel = mongoose.model("MonthlyLeaderboard", monthlyLeaderboardSchema)

export default monthlyLeaderboardModel