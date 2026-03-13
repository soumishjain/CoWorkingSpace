import { useState } from "react"

export const useWorkspaceState = () => {
    const [workspaces , setWorkspaces] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    return {
        workspaces,
        setWorkspaces,
        loading,
        setLoading,
        error,
        setError
    }
}