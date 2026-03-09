import activityModel from "../../models/activity.models.js"
import departmentMemberModel from "../../models/departmentMember.models.js"
import workspaceMemberModel from "../../models/workspaceMember.models.js"

export async function getDepartmentActivities(req,res) {
    try{

        const {page=1 , limit=20} = req.query
        const department = req.department
        const workspace = req.workspace

        const departmentId = department._id
        const workspaceId = workspace._id

        const member = await departmentMemberModel.findOne({
            userId,
            departmentId
        })

        const admin = await workspaceMemberModel.findOne({
            userId,
            workspaceId,
            role : 'admin'
        })

        if(!member && !admin) {
            return res.status(403).json({
                message : "Not Authorized"
            })
        }

        const limitNum = parseInt(limit)
        const skip = (page-1)*limitNum

        const activities = await activityModel.find({
            departmentId : department._id
        })
        .populate("userId", "name profileImage")
        .sort({createdAt : -1})
        .skip(skip)
        .limit(limitNum)

        res.status(200).json({
            message : "Activity fetched",
            activities
        })

    }catch(error){
        res.status(500).json({
            message : "Internal Server error"
        })
    }
}