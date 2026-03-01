import jwt  from "jsonwebtoken";

export async function identifyUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message : "Unauthorized Access"
        })
    }

    let decode;
    try{
        decode = jwt.verify(token,process.env.JWT_SECRET)
    }catch(error){
        return res.status(401).json({
            message : "Unauthorized Access"
        })
    }

    req.userId = decode.id
    next()
}