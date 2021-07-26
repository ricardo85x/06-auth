import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { parseCookies } from "nookies"

export const withSSRGuest = <P>(fn: GetServerSideProps<P>) =>  {
    
    return async (ctx: GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> => {
        

        const cookies = parseCookies(ctx)

        if (cookies['nextauth.token']) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false // true will always happen, false did happen because of a condition 
                }

            }
        }

        return await fn(ctx)
    }

}