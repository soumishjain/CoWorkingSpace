import notificationModel from "../models/notification.models";

export async function createNotification(data){
    return await notificationModel.create(data)
}