import userModel from "../../models/user.models.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from "../../services/mail.services.js"


export async function registerUser(req,res){
   try{
     const {name , email , password, profileImage } = req.body

    if(!name || !email || !password) {
        return res.status(400).json({
            message : "All fields are required"
        })
    }

    const isEmailAlreadyExists = await userModel.findOne({email : email})

    if(isEmailAlreadyExists){
        return res.status(409).json({
            message : "User Already Exists"
        })
    }

    const hash = await bcrypt.hash(password,10)


    const user = await userModel.create({name , email , password : hash , profileImage , isVerified : false})

    const rawToken = crypto.randomBytes(32).toString("hex")
    
    const hashedToken = crypto
  .createHash("sha256")
  .update(rawToken)
  .digest("hex");

  user.emailVerificationToken = hashedToken
  user.emailVerificationExpiry = Date.now() + 15 * 60 * 1000

  await user.save()

  const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${rawToken}`

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html : `
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
  })


    res.status(201).json({
        message : "User Successfully Created",
        user : {
            name : name ,
            email , 
            profileImage : profileImage
        }
    })
   }catch(error){
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
   }

}


export async function verifyEmail(req,res){
    try{
        const {token} = req.query;

        if(!token) {
             return res.status(400).send("Invalid Vefification Link")
        }

        const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

      const user = await userModel.findOne({
        emailVerificationToken : hashedToken,
        emailVerificationExpiry: {$gt: Date.now()}
      })

      if(!user){
        return res.status(400).send("Token expired or invalid")
      }

      user.isVerified = true,
      user.emailVerificationExpiry = undefined
      user.emailVerificationToken = undefined

      await user.save()

      const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect("http://localhost:5173")
    } catch(error){
        console.log(error)
        res.status(500).send("Something Went Wrong")
    }
}

export async function loginUser(req,res){
    try{
    const {email , password } = req.body;
    if(!email || !password){
        return res.status().json({
            message : "Please Enter the details"
        })
    }

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(404).json({
            message : "User not found"
        })
    }

    if(!user.isVerified){
        return res.status(403).json({
            message : "User not verified"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(401).json({
            message : "Invalid Password"
        })
    }

    const token = jwt.sign({
        id : user._id
    },process.env.JWT_SECRET,{expiresIn : '1d'})

     res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });

}catch(error){
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
}
}

export async function logoutUser(req,res){
    try{
        res.clearCookie("token", {
            httpOnly: true,
    sameSite: "lax",
    secure: false
        })

        res.status(200).json({
            message : "Logged out Successfully"
        })


    }catch(error){
        console.error(error)
    }
}

export async function getMe(req,res) {
    const userId = req.userId
    const user = await userModel.findById(userId)

    if(!user){
        return res.status(401).json({
            message : "Unauthorized Access"
        })
    }

    return res.status(200).json({
        message : "User Details Successfully fetched",
        user : {
            name : user.name ,
            email : user.email,
            profileImage : user.profileImage ,
            avatar : user.avatar
        }
    })
}