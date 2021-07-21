import { GetServerSideProps } from "next"
import { FormEvent, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import styles from "../styles/Home.module.css"
import {parseCookies} from "nookies"

export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {signIn} = useAuth()

  const handleSubmit = async (event : FormEvent) => {

    event.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)


  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
       />
       <button type="submit">Enter</button>


    </form>
  )
}

export const getServerSideProps : GetServerSideProps = async (ctx) => {

  console.log(ctx.req.cookies)

  const cookies = parseCookies(ctx)

  if(cookies['nextauth.token']) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false // true will always happen, false did happen because of a condition
      }
      
    }
  }

  return {
    props: {}
  }
}