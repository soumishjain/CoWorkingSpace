import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/auth.api"


export const useLogin = (state) => {
const navigate = useNavigate()

    const {formData , setLoading , setError} = state
    const submitLogin = async () => {
        try{
            setLoading(true)

            const data = await loginUser(formData)

            console.log("Login Success : " , data)
            
            navigate('/dashboard')

        }catch(error){
            setError(error.response?.data?.message || "Login Failed")
        }finally{
            setLoading(false)
        }
    }
    return {submitLogin}
}