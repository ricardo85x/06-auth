import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/apiClient"
import { setupApiClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
import { useCan } from "../hooks/useCan"
import { Can } from "../components/Can"
import { GetServerSideProps } from "next"

export default function Dashboard() {

    const { user } = useAuth()

    const userCanSeeMetrics = useCan({ 
        permissions: ['metrics.list']
    })

    

    useEffect(() => {
        api.get("/me")
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }, [])


    return (
        <>
        <h1>DashBoard {user?.email}</h1>
        { userCanSeeMetrics && <div>Metrics</div>}

        <Can roles={['editor']}>
            <div>Editor component</div>
        </Can>


        <Can roles={['client']}>
            <div>Client component</div>
        </Can>


        <Can permissions={['users.list']}>
            <div>User list component</div>
        </Can>

        




        </>
    )
}

export const getServerSideProps:GetServerSideProps = withSSRAuth(async (ctx) => {

    const apiServer = setupApiClient(ctx)

    const response = await apiServer.get("/me");

    console.log(response)

    return {
        props: {

        }
    }
})