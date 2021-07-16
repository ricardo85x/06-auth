import axios from "axios"

export const api = axios.create({
    baseURL: "https://mockup-auth.vercel.app"
})