import axios from './axios'

export const getUserWorkspace = async() => {
    const res = await axios.get('/workspace/get-my-workspaces', {
        withCredentials : true
    })
    return res.data
}

export const createWorkspace = async (formData) => {
    const data = new FormData()

    data.append("name" , formData.name)
    data.append("description" , formData.description)
    data.append("joinPassword",formData.joinPassword)

    if(formData.coverImage) {
        data.append("coverImage" , formData.coverImage)
    }

    const response = await axios.post('/workspace/create' , data)
    return response.data
}