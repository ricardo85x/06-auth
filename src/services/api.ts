import axios, { AxiosError } from "axios"
import { parseCookies, setCookie } from "nookies"
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false
let failedRequestQueue = [];

export const setupApiClient = (ctx = undefined) => {


    let cookies = parseCookies(ctx)


    const api = axios.create({
        baseURL: "https://mockup-auth.vercel.app",
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    })
    
    // intercept requests
    api.interceptors.response.use(
        res => res,  // on success don't touch it!
        (err: AxiosError) => {     // on error....
    
            if (err.response.status === 401) {
                if (err.response?.data?.code === 'token.expired') {
                    // renew the token
                    cookies = parseCookies(ctx ) // reload the cookies
    
                    // get the current refreshToken from cookies
                    const { 'nextauth.refreshToken': refreshToken } = cookies;
    
                    // get the axios config that is need to replicate a request
                    const originalConfig = err.config;
    
                    // check I am the first!
                    if (!isRefreshing) {
    
                        // block everbody else
                        isRefreshing = true;
    
                        // get a new token using the refreshToken
                        api.post<{ token: string, refreshToken: string }>("/refresh", {
                            refreshToken
                        }).then(response => {
    
                            const { data } = response
                            // save the updated token and refreshTonen on cookie
                            setCookie(ctx, 'nextauth.token', data.token, {
                                maxAge: 60 * 60 * 24 * 30, // 30 days
                                path: '/'
    
                            })
                            setCookie(ctx, 'nextauth.refreshToken', data.refreshToken, {
                                maxAge: 60 * 60 * 24 * 30, // 30 days
                                path: '/'
                            })
    
                            // update the header with the new token
                            api.defaults.headers['Authorization'] = `Bearer ${data.token}`;
    
    
                            // get all request that was running after this, 
                            // and run it again with the updated token				
                            failedRequestQueue.forEach(request => request.onSuccess(data.token))
                            // clear the list
                            failedRequestQueue = [];
    
    
                        })
                            .catch(err => {
                                // on error reject the list and clear the list
                                failedRequestQueue.forEach(request => request.onFailure(err))
                                failedRequestQueue = [];
                                
                                if(process.browser){
                                    signOut()
                                } else {
                                    console.log("Error on server not to do...")
                                    return Promise.reject(new AuthTokenError())
                                }
                                
                            })
    
                            .finally(() => {
                                // allow another request to fall in this condition
                                isRefreshing = false
                            })
                    }
    
                    return new Promise((resolve, reject) => {
                        // get all requests on Queue and add two funcions
                        // the onSucess will update the token
                        // the onFailure will reject with a error
                        failedRequestQueue.push({
                            onSuccess: (token: string) => {
                                originalConfig.headers['Authorization'] = `Bearer ${token}`;
    
                                resolve(api(originalConfig))
                            },
                            onFailure: (err: AxiosError) => {
                                reject(err)
                            }
                        })
                    })
    
                } else {
                    // logout the user
                    if(process.browser){
                        signOut()
                    } else {
                        return Promise.reject(new AuthTokenError())
                    }
                }
            }
    
            return Promise.reject(err);
        }
    )


    return api

}