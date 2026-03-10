import cron from 'node-cron'
import departmentMemberModel from '../models/departmentMember.models.js'
import monthlyLeaderboardModel from '../models/monthlyLeaderboard.models.js'
import departmentModel from '../models/department.models.js'

cron.schedule("0 0 1 * *", async () => {
    console.log("Running monthly leaderboard reset")
    try{
        const members = await departmentMemberModel.find({
            role : 'employee'
        })

        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        const departments = {}

        members.forEach(member => {
            const depId = member.departmentId.toString()

            if(!departments[depId]){
                departments[depId] = []
            }

            departments[depId].push(member)
        })

        for(const depId in departments) {
            const departmentMembers = departments[depId]

            departmentMembers.sort(
                (a,b) => b.currentMonthPoints - a.currentMonthPoints
            )

                const department = await departmentModel.findById(depId)

                const rankings = departmentMembers.map((member , index) => ({
                    userId : member.userId,
                    points : member.currentMonthPoints,
                    rank : index + 1
                }))

                await monthlyLeaderboardModel.create({
                    workspaceId : department.workspaceId,
                    departmentId : depId,
                    month,
                    year,
                    rankings
                })
            
                for(const member of departmentMembers){
                member.currentMonthPoints = 0
                await member.save()
                }

        }

        console.log("Leaderboard reset complegted")


    }catch(error){
        console.error("Leaderboard reset errro",error)
    }
})