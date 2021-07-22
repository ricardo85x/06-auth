import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/apiClient"
import {setupApiClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import {destroyCookie} from "nookies"

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

    // try {

        const response = await apiServer.get("/me");
        console.log(response)

    // } catch (err) {
    //     console.log(err instanceof AuthTokenError)

    //     destroyCookie(ctx,"nextauth.token")
    //     destroyCookie(ctx,"nextauth.refreshToken ")

    //     return {
    //         redirect: {
    //             destination: "/",
    //             permanent: false
    //         }
    //     }
    // }

    return {
        props: {

        }
    }
})