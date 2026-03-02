import departmentModel from "../../models/department.models";
import departmentMemberModel from "../../models/departmentMember.models";
import workspaceModel from "../../models/workspace.models";
import workspaceMemberModel from "../../models/workspaceMember.models";


export async function createDepartment(req,res){
    try{
        const {workspaceId} = req.params;
    const userId = req.userId

    const workspace = await workspaceModel.findById(workspaceId)

    if(!workspace){
        return res.status(404).json({
            message : "Workspace not found"
        })
    }

    const admin = await workspaceMemberModel.findOne({userId , workspaceId})

    if(!admin || admin.role !== 'admin') {
        return res.status(403).json({
            message : "You are not authorized to create a department in this workspace"
        })
    }

    const {name , description} = req.body
    const department = await departmentModel.create({
        name : name , 
        description : description,
        workspaceId : workspaceId ,
        createdBy : userId 
    })

    res.status(200).json({
        message : "Department created Successfully",
        department : department 
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}