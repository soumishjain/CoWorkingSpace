import axios from 'axios'

const api = axios.create({
    baseURL : "http://localhost:3000/api",
    withCredentials : true,
    headers: {
        "Cache-Control" : "no-cache"
    }
})

export default api