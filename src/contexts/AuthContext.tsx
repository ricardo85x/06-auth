import { useRouter } from "next/router";
import { ReactNode, useContext, useState } from "react";
import {parseCookies, setCookie} from "nookies"
import { createContext } from "react";
import { api } from "../services/api";
import { useEffect } from "react";

type User = {
    email: string;
    permissions: string[];
    roles: string[]; 
}

type SessionsResponseProps = {
    token: string;
    refreshToken: "string";
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    user: User;
    signIn(credentials:SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({children}: AuthProviderProps) => {

    const router = useRouter()

    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;


    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();

        if (token){
            api.get<User>("/me").then((response) => {
                const { email, permissions, roles }  = response.data;
                setUser( {email, permissions, roles} )
            })
        }

    },[])


    const signIn = async ({email, password} : SignInCredentials) => {

        try {

            const response = await api.post<SessionsResponseProps>("/sessions", {
                email, 
                password
            })

            const {token, refreshToken, permissions, roles} = response.data

            setCookie(undefined,'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'

            })
            setCookie(undefined,'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })
            
            // @sessionStorage - valid until user close browser
            // @localStorage - persist after browser close, 
            // but next cant read it when using serverSideProps
            // @cookies - the way to go \o/

            setUser({
                email,
                permissions,
                roles
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;
             
            router.push("/dashboard")

            console.log(response)

        } catch (err){
            console.log(err)
        }
    }

    const value = {isAuthenticated, signIn, user} as AuthContextData;

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)