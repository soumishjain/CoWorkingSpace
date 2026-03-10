import notificationModel from "../../models/notification.models"

export async function getMyNotification(req,res){
    try{
        const userId = req.userId

        const notification = await notificationModel.find({userId})
        .sort({createdAt : -1})
        .limit(50)

        res.status(200).json({
            notification
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function markNotification(req,res) {
    try{

        const {notificationId} = req.params
        const userId = req.userId
        const notification = await notificationModel.findOne({
            _id : notificationId,
            userId
        })

        if(!notification) {
            return res.status(404).json({
                message : "Notification not found"
            })
        }

        notification.isRead = true;
        await notification.save()

        res.status(200).json({
            message : "Notification marked as read"
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}

export async function markAllNotificationAsRead(req,res){
    try{
        const userId = req.userId

        await notificationModel.updateMany({
            userId ,
            isRead : false
        },
    {
        $set : {isRead : true}
    })


    return res.status(200).json({
        message : "All notification marked as read"
    })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getUnreadNotificationCount(req,res){
    try{

        const userId = req.userId
        const count = await notificationModel.countDocuments({
            userId , 
            isRead : false
        })

        return res.status(200).json({
            message : "Unread notification count fetched",
            count
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internsal Server Error"
        })
    }
}