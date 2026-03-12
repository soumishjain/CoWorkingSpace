import { useState } from "react"

export const useRegisterState = () => {
    const [formData , setFormData] = useState({
        name : "",
        email : "",
        username : "",
        password : "",
        confirmPassword : "",
        profileImage : null
    }) 

     const [emailSent , setEmailSent] = useState(false)
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState("")

    return {
        formData,
        setFormData,
        loading,
        setLoading,
        error,
        setError,
        emailSent,
        setEmailSent
    }
}