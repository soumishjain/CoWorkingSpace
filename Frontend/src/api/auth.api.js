import axios from './axios'

export const registerUser = async (formData) => {
    const data = new FormData()

    data.append("name" , formData.name)
    data.append("email" , formData.email)
    data.append("username" , formData.username)
    data.append("password" , formData.password)

    if(formData.profileImage) {
        data.append("profileImage" , formData.profileImage)
    }

    const response = await axios.post("/auth/register", data)

    return response.data

}

export const loginUser = async(formData) => {
    const response = await axios.post('/auth/login',{
        identifier : formData.identifier,
        password: formData.password
    })

    console.log(response)

    return response.data
}