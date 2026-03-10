import { generateSubtasks } from "../../services/ai.services.js";

export async function generateTaskSubtasks(req,res) {
    try{
        const {title , description} = req.body

        if(!title) {
            return res.status(400).json({
                message : "Task Title required"
            })
        }
        const aiResponse = await generateSubtasks(title)

        const subtasks = aiResponse.split("\n")
        .map(s => s.replace(/^\d+\.\s*/,"").trim())
        .filter(Boolean)

        res.status(200).json({
            message : "AI Subtasks generated",
            subtasks
        })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "AI Generation Failed"
        })
    }
}