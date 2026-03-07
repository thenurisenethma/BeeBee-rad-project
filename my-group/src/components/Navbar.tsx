import { useNavigate } from "react-router-dom"
import bee from "../assets/bee logo.png"

export default function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    navigate("/", { replace: true })
  }

  return (
    <nav className="w-full bg-black shadow-md px-8 py-2 flex justify-between items-center">
        <div className="flex items-center gap-0">
    
    <h1 className="text-xl font-bold text-yellow-600 cursor-pointer">
      BeeBee
    </h1><img
      src={bee}
      alt="bee"
      className="w-20 h-15"  
    />
  </div>

      <div className="flex items-center gap-4">
        <span className="text-yellow-400 font-medium">
         Logged as {username} 
        </span>

        <button
          onClick={handleLogout}
          className="
            px-4 py-2 
            rounded-xl 
            bg-yellow-300 
            text-black 
            font-semibold 
            transition-all 
            duration-300 
            hover:bg-black 
            hover:text-yellow-300
          "
    >
          Logout
        </button>
      </div>
    </nav>
  )
}
