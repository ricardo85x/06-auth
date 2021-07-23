import { GetServerSideProps } from "next"
import { setupApiClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Metrics( {  test }) {


    return (
        <>
            <h1>Metrics</h1>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx) => {

    const apiServer = setupApiClient(ctx)

    await apiServer.get("/me");


    return {
        props: {
            test: "ola"
        }
    }
}, {
    permissions: ['metrics.list'],
    roles: ['administrator']
})