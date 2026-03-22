import axios from "../api/axios.js";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    const fetchUser = async () => {
        try{
            console.log("Fetching User...")
            const res = await axios.get('/auth/getme', {
                withCredentials : true
            })

            console.log(res)
            setUser(res.data.user)
        }catch(err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    },[])

    const logout = async () => {
        await axios.post('/auth/logout', {}, {withCredentials: true})
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user,setUser,logout,loading}}>
            {children}
        </AuthContext.Provider>
    )

    
}


export const useAuth = () => useContext(AuthContext)