import mongoose from 'mongoose'

const departmentMemberSchema = new mongoose.Schema({
    userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        required : true,
    },
    role : {
        type : String,
       enum: ["manager", "employee"],
    required: true
  },
  currentMonthPoints : {
        type : Number,
        default : 0
    },
    lifetimePoints : {
        type : Number , 
        default : 0
    }
}, { timestamps: true });

departmentMemberSchema.index(
  { userId: 1, departmentId: 1 },
  { unique: true }
);

const departmentMemberModel = mongoose.model("DepartmentMember", departmentMemberSchema)
export default departmentMemberModel