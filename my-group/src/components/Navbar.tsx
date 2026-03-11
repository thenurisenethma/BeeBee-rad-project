import { useNavigate } from "react-router-dom"
import { useState } from "react"
import bee from "../assets/bee logo.png"

export default function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    navigate("/", { replace: true })
  }

  return (
    <nav className="w-full bg-black shadow-md px-6 py-3">

      {/* Top bar */}
      <div className="flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-bold text-yellow-600 cursor-pointer">
            BeeBee
          </h1>

          <img
            src={bee}
            alt="bee"
            className="w-16"
          />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          <a href="/dashboard" className="text-gray-300 hover:text-yellow-400">
            Dashboard
          </a>

          <a href="/tasks" className="text-gray-300 hover:text-yellow-400">
            Tasks
          </a>

          <a href="/ai" className="text-gray-300 hover:text-yellow-400">
            AI Assistant
          </a>
        </div>

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-yellow-400 font-medium">
            Logged as {username}
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-yellow-300 text-black font-semibold hover:bg-black hover:text-yellow-300 transition"
          >
            Logout
          </button>
        </div>

        {/* Burger button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-yellow-400 text-2xl"
        >
          ☰
        </button>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-black border-t border-gray-700 pt-4">

          <a href="/dashboard" className="text-gray-300 hover:text-yellow-400">
            Dashboard
          </a>

          <a href="/tasks" className="text-gray-300 hover:text-yellow-400">
            Tasks
          </a>

          <a href="/ai" className="text-gray-300 hover:text-yellow-400">
            AI Assistant
          </a>

          <span className="text-yellow-400">
            Logged as {username}
          </span>

          <button
            onClick={handleLogout}
            className="w-fit px-4 py-2 rounded-xl bg-yellow-300 text-black font-semibold hover:bg-black hover:text-yellow-300 transition"
          >
            Logout
          </button>

        </div>
      )}

    </nav>
  )
}