import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true
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
        default : "https://ik.imagekit.io/soumisjain/download.png"
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    emailVerificationToken : String,
    emailVerificationExpiry : Date
},{
    timestamps : true
})

userSchema.index(
    {createdAt : 1},
    {
        expireAfterSeconds : 900,
        partialFilterExpression : {isVerified: false}
    }
)

const userModel = mongoose.model("User" , userSchema)

export default userModel