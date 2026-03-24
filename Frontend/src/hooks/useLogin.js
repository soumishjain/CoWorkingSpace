import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/auth.api"
import { useAuth } from "../context/AuthContext"


export const useLogin = (state) => {
const navigate = useNavigate()
const {setUser} = useAuth()
    const {formData , setLoading , setError} = state
    const submitLogin = async () => {
        try{
            setLoading(true)

            const data = await loginUser(formData)

            console.log("Login Success : " , data)
            localStorage.setItem("token",data.token)
            setUser(data.user)
            navigate('/dashboard')

        }catch(error){
            setError(error.response?.data?.message || "Login Failed")
        }finally{
            setLoading(false)
        }
    }
    return {submitLogin}
}