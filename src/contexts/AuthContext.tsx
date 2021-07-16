import { ReactNode, useContext } from "react";
import { createContext } from "react";
import { api } from "../services/api";

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials:SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({children}: AuthProviderProps) => {

    const isAuthenticated = false;
    const signIn = async ({email, password} : SignInCredentials) => {

        try {

            const response = await api.post("/sessions", {
                email, 
                password
            })

            console.log(response)

        } catch (err){
            console.log(err)
        }
    }

    const value = {isAuthenticated, signIn} as AuthContextData;

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)