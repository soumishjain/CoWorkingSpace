import notificationModel from "../models/notification.models.js";

export async function createNotification(data){
    return await notificationModel.create(data)
}