import { useState } from "react"

export const useLoginState = () => {
    const [formData , setFormData] = useState({
        identifier : "",
        password : ""
    })

    const [loading , setLoading] = useState(false)
    const [error , setError] = useState("")

    return {
        formData , setFormData , loading , setLoading , error , setError
    }
}