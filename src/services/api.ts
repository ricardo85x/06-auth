import axios from "axios"
import {parseCookies} from "nookies"

const cookies = parseCookies()

export const api = axios.create({
    baseURL: "https://mockup-auth.vercel.app",
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
})