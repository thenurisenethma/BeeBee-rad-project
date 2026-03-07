import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import AuthCard from "../components/AuthCard"

export default function SignUp() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      console.log("Signup response:", data)

      if (!res.ok) {
        alert(data.message)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data._id)


      navigate("/")

    } catch (error) {
      alert("Something went wrong")
    }
  }

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

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
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-600 font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
