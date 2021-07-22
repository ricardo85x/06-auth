import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../services/errors/AuthTokenError"

export const withSSRAuth = <P>(fn: GetServerSideProps<P>) => {

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        console.log(ctx.req.cookies)

        const cookies = parseCookies(ctx)

        if (!cookies['nextauth.token']) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false // true will always happen, false did happen because of a condition 
                }

            }
        }

        try {
            const response = await fn(ctx);
            return response

        } catch (err) {
            if (err instanceof AuthTokenError) {

                destroyCookie(ctx, "nextauth.token")
                destroyCookie(ctx, "nextauth.refreshToken ")

                return {
                    redirect: {
                        destination: "/",
                        permanent: false
                    }
                }
            } 
        }

    }

}