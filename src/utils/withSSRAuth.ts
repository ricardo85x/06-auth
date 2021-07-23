import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import decode from "jwt-decode"
import { validateUserPermissions } from "./validateUserPermissions"


interface WithSSRAuthOptionsProps {
    permissions?: string[];
    roles?: string[]
}

export const withSSRAuth = <P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptionsProps) => {


    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {


        const cookies = parseCookies(ctx)
        const token = cookies['nextauth.token']


        if (!token) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false // true will always happen, false did happen because of a condition 
                }

            }
        }

        if (options) {
            const user = decode<{ permissions: string[], roles: string[] }>(token)
            const { permissions, roles } = options

            const userHasValidPermissions = validateUserPermissions({ user, permissions, roles })


            console.log("Le User token", user)

            if(!userHasValidPermissions){

                return {

                    //notFound if we want to send the user to a 404 page
                    redirect: {
                        destination: "/dashboard",
                        permanent: false
                    }
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
            } else {

                console.log("Error not detected", err)
                return {
                    notFound: true,
                }
            }
        }

    }

}