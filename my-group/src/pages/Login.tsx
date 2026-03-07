import AuthCard from "../components/AuthCard"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        return
      }


      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.name)
      localStorage.setItem("userId", data._id)

      navigate("/dashboard")

    } catch (error) {
      alert("Try again")
    }
  }

  return (
    <AuthCard title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg invalid:border-pink-500 invalid:text-pink-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <button
          type="submit"
          className="
            w-full 
            py-3 
            rounded-xl 
            bg-yellow-300 
            text-black 
            font-semibold 
            transition-all 
            duration-300 
            hover:bg-black 
            hover:text-yellow-300
          "        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
