import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type: String,
        required: true,
        select : false
    },
    profileImage : {
        type : String,
        default : "https://i.pinimg.com/736x/ae/59/cf/ae59cfb3afd5c3426bd270588334096c.jpg"
    },
    avatar : {
        type : String,
        default : "warrior"
    }
},{
    timestamps : true
})

const userModel = mongoose.model("User" , userSchema)

export default userModel