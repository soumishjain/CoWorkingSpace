import mongoose from "mongoose"
import departmentMemberModel from "../../models/departmentMember.models.js"
import workspaceMemberModel from "../../models/workspaceMember.models.js"
import monthlyLeaderboardModel from "../../models/monthlyLeaderboard.models.js"

export async function getDepartmentLeaderBoard(req,res) {
    try{
        const department = req.department
        const departmentId = department._id
        const workspace = req.workspace
        const workspaceId = workspace._id

        const userId = req.userId

        const user = await departmentMemberModel.findOne({userId , departmentId})

        const admin = await workspaceMemberModel.findOne({workspaceId , userId , role : 'admin'})

        if(!user && !admin){
            return res.status(403).json({
                message : "Not authorized"
            })
        }
        const leaderboard = await departmentMemberModel.aggregate([
            {
                $match : {
                    departmentId : new mongoose.Types.ObjectId(departmentId),
                    role : 'employee'
                }
            },
            {
                $sort :{
                    currentMonthPoints : -1,
                }
            },
            {
                    $limit : 50

            },
            {
                $lookup : {
                    from : 'users',
                    localField : "userId",
                    foreignField : "_id",
                    as: "user"
                }
            },
            {
                $unwind : "$user"
            },
            {
                $project : {
                    _id : 0,
                    userId : "$user._id",
                    name : "$user.name",
                    email : "$user.email",
                    profileImage : "$user.profileImage",
                    points : "$currentMonthPoints"
                }
            }
        ])

        return res.status(200).json({
            message : "Leaderboard fetched successfully",
            total: leaderboard.length,
            leaderboard
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getTopPerformers(req,res){
    try{

       const department = req.department
        const departmentId = department._id
        const workspace = req.workspace
        const workspaceId = workspace._id

        const userId = req.userId

        const user = await departmentMemberModel.findOne({userId , departmentId})

        const admin = await workspaceMemberModel.findOne({workspaceId , userId , role : 'admin'})

        if(!user && !admin){
            return res.status(403).json({
                message : "Not authorized"
            })
        }

        const top = await departmentMemberModel.aggregate([
            {
                $match : {
                    departmentId : new mongoose.Types.ObjectId(departmentId),
                    role : 'employee'
                }
            },
            {
                $sort : {
                    currentMonthPoints : -1,
                }
            },
            {
                $limit : 3
            },
            {
                $lookup : {
                    from : "users",
                    localField : "userId",
                    foreignField : "_id",
                    as : "user"
                }
            },
            {
                $unwind : "$user"
            },
            {
                $project : {
                    _id : 0,
                    name : "$user.name",
                    email : "$user.email",
                    profileImage : "$user.profileImage",
                    points : "$currentMonthPoints"
                }
            }
        ])

        return res.status(200).json({
            message : "top performers fetched",
            top
        })



    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getMyRank(req, res) {
  try {
    const userId = req.userId;
    const departmentId = req.department._id;
    const workspaceId = req.workspace._id;

    // 🔥 check roles
    const user = await departmentMemberModel.findOne({ userId, departmentId });
    const admin = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
      role: "admin",
    });

    // ❌ block only if neither
    if (!user && !admin) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    // 🔥 leaderboard only employees
    const leaderboard = await departmentMemberModel.aggregate([
      {
        $match: {
          departmentId: new mongoose.Types.ObjectId(departmentId),
          role: "employee",
        },
      },
      {
        $sort: { currentMonthPoints: -1 },
      },
    ]);

    // 🔥 if user is NOT employee (admin/manager)
    if (!user || user.role !== "employee") {
      return res.status(200).json({
        rank: null,
        points: 0,
        totalMembers: leaderboard.length,
        message: "Not competing in leaderboard",
      });
    }

    // 🔥 find rank
    const index = leaderboard.findIndex(
      (m) => m.userId.toString() === userId
    );

    if (index === -1) {
      return res.status(200).json({
        rank: null,
        points: user.currentMonthPoints || 0,
        totalMembers: leaderboard.length,
      });
    }

    const myData = leaderboard[index];

    return res.status(200).json({
      rank: index + 1,
      points: myData.currentMonthPoints,
      totalMembers: leaderboard.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getLeaderboardStats(req , res) {

    try{
        const departmentId = req.department._id
        const workspaceId = req.workspace._id
        const userId = req.userId

        const manager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
        const admin = await workspaceMemberModel.findOne({userId , workspaceId , role:'admin'})

        if(!manager && !admin) {
            return res.status(403).json({
                message : "Unauthorized Access"
            })
        }

        const stats = await departmentMemberModel.aggregate([
            {
                $match : {
                    departmentId : new mongoose.Types.ObjectId(departmentId),
                    role : 'employee'
                }
            },
            {
                $group : {
                    _id : null,
                    totalMembers : {$sum : 1},
                    totalPoints : {$sum : "$currentMonthPoints"},
                    highestPoints : {$max : "$currentMonthPoints"},
                    averagePoints : {$avg : "$currentMonthPoints"}
                }
            }
        ])

        return res.status(200).json({
            message : "Leaderboard stats fetched",
            stats : stats[0]
        })
    } catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server error"
        })
    }

}

export async function getMyPosition(req,res) {
    try{
        const userId = req.userId
    const departmentId = req.department._id

    const leaderboard = await departmentMemberModel.aggregate([
        {
            $match : {
                departmentId : new mongoose.Types.ObjectId(departmentId),
                role : 'employee'
            }
        },
        {
            $sort : {
                currentMonthPoints : -1
            }
        }
    ])

    const index = leaderboard.findIndex(
        m => m.userId.toString() === userId
    )

    if(index === -1){
        return res.status(404).json({
            message : "user not found in leaderboard"
        })
    }

    const myData = leaderboard[index]

    let nextRankPoints = null
    let pointsNeeded = null
    if(index > 0){
        const nextUser = leaderboard[index-1]

        nextRankPoints = nextUser.currentMonthPoints
        pointsNeeded = nextUser.currentMonthPoints - myData.currentMonthPoints
    }

    return res.status(200).json({
        rank : index + 1,
        points : myData.currentMonthPoints,
        nextRankPoints,
        pointsNeeded,
        totalMembers : leaderboard.length
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getPreviousMonthWinner(req, res) {
  try {
    const departmentId = req.department._id;
    const workspaceId = req.workspace._id;

    const now = new Date();

    // 🔥 last month calculate
    let month = now.getMonth(); // current month -1 automatically
    let year = now.getFullYear();

    if (month === 0) {
      month = 12;
      year -= 1;
    }

    // 🔥 find last month leaderboard
    const leaderboard = await monthlyLeaderboardModel.findOne({
      departmentId,
      workspaceId,
      month,
      year,
    }).populate("rankings.userId", "name email profileImage");

    if (!leaderboard || leaderboard.rankings.length === 0) {
      return res.status(200).json({
        winner: null,
      });
    }

    // 🔥 top performer = rank 1
    const top = leaderboard.rankings.find((r) => r.rank === 1);

    if (!top) {
      return res.status(200).json({
        winner: null,
      });
    }

    return res.status(200).json({
      winner: {
        name: top.userId.name,
        email: top.userId.email,
        profileImage: top.userId.profileImage,
        points: top.points,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}