import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/apiClient"
import {setupApiClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {

    const {user} = useAuth()

    useEffect(() => {
        api.get("/me")
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }, [])
    

    return (
        <h1>DashBoard {user?.email}</h1>
    )
}

export const ServerSideProps = withSSRAuth(async(ctx) => {

    const apiServer = setupApiClient(ctx)

    const responde = await apiServer.get("/me");

    return {
        props: {

        }
    }
})