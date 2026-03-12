import { registerUser } from "../api/auth.api"
import {useNavigate} from 'react-router-dom'


export const useRegister = (state) => {

 const {formData,setError,setLoading,setEmailSent} = state


 const submitRegister = async () => {

  if(formData.password !== formData.confirmPassword){
   setError("Passwords do not match")
   return
  }

  try{

   setLoading(true)

   await registerUser(formData)

   setEmailSent(true)
   

  }catch(err){

   setError(err.response?.data?.message || "Registration failed")

  }finally{
   setLoading(false)
  }

 }

 return {submitRegister}

}