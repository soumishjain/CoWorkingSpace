import departmentMemberModel from "../models/departmentMember.models"

export async function validateManager(req,res,next) {
    try{
        const userId = req.userId
    const department = req.department
    const departmentId = department._id
    const manager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
    if(!manager) {
        return res.status(403).json({
            message : "Not Authorized"
        })
    }
    next()
    }catch(error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}