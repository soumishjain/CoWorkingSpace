import activityModel from "../models/activity.models.js";

export async function createActivity(data){
    return await activityModel.create(data)
}