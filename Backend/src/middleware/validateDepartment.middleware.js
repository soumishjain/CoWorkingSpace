import departmentModel from "../models/department.models.js"

export async function validateDepartment(req,res , next){
    try{
        const {departmentId} = req.params

        const workspace = req.workspace

    const department = await departmentModel.findOne({
        _id : departmentId,
        workspaceId : workspace._id
    })

    if(!department) {
        return res.status(404).json({
            message : "Department not found"
        })
    }

    req.department = department
    next()
    }catch(error){
        return res.status(400).json({
            message : "Wrong workspace or department Id"
        })
    }

}