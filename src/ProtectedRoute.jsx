import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/authContext"

function ProtectedRoute(){
    const {loading , isAuthenticated } =useAuth()
    console.log(loading, isAuthenticated)

    if(loading) return <h1>loading ...</h1>
    if(!loading && !isAuthenticated) return <Navigate to= '/' replace/>
    return(
        <Outlet/>
    )
}

export default ProtectedRoute;