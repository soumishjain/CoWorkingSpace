import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Workspace",
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
    },
    type:{
    type:String,
    enum:[
      "TASK_ASSIGNED",
      "TASK_APPROVED",
      "TASK_REJECTED",
      "MEMBER_ADDED",
      "MANAGER_ASSIGNED",
      "MEMBER_LEFT",
      "MEMBER_REMOVED",
      "JOIN_REQUEST_APPROVED",
      "JOIN_REQUEST_REJECTED",
      "JOIN_REQUEST"
    ]
  },
  message : {
    type : String,
    required : true
  },
  isRead : {
    type : Boolean,
    default : false
  }
},{timestamps : true})

notificationSchema.index({userId:1 , createdAt: -1})

const notificationModel = mongoose.model("Notification",notificationSchema)

export default notificationModel