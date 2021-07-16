import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {

    const {isAuthenticated, user} = useAuth()

    

    return (
        <h1>DashBoard {user.email}</h1>
    )
}