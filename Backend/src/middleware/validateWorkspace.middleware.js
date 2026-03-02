import workspaceModel from "../models/workspace.models"

export async function validateWorkspace(req,res , next){
    try{
        const {workspaceId} = req.params

    const workspace = await workspaceModel.findById(workspaceId).select("-joinPassword")

    if(!workspace) {
        return res.status(404).json({
            message : "Workspace not found"
        })
    }

    req.workspace = workspace
    next()
    }catch(error){
        return res.status(400).json({
            message : "invalid workspace Id"
        })
    }

}