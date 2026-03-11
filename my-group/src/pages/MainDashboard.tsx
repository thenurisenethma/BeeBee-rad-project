import { useNavigate } from "react-router-dom"
import bee from "../assets/bee logo.png"
import { useState, useEffect } from "react"
import beeQuote from "../assets/bee-quote.png" 

export default function MainDashboard() {
  const navigate = useNavigate()

  const username = localStorage.getItem("username") || "Bee"

  const [tasks, setTasks] = useState<any[]>([])
  const token = localStorage.getItem("token")

  const completedCount = tasks.filter(
    (task: any) => task.status === "Completed"
  ).length

  const totalCount = tasks.length

  const progress =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100)
  const userId = localStorage.getItem("userId") || ""

  const refreshTasks = () => {
    window.location.reload()
  }
  
useEffect(() => {
  if (!token || !userId) return

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      setTasks(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  fetchTasks()
}, [userId, token])

const [hovered, setHovered] = useState(false)

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">

      {/*Welcome  */}
    <div
      className={`
        rounded-3xl p-8 shadow-md relative overflow-hidden cursor-pointer
        transition-all duration-500
        ${hovered ? "bg-slate-400" : "bg-black"}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="transition-colors duration-500">
        {!hovered ? (
          <>
            <h2 className="text-3xl font-bold transition-colors duration-500 text-yellow-600">
              Hi {username}
            </h2>
            <p className="text-yellow-200 mt-2 transition-colors duration-500">
              Let’s make today productive and sweet ✨
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl italic font-bold transition-colors duration-500 text-black">
              BeeBee’s Wisdom
            </h2>
            <p className="text-black mt-3 italic transition-colors duration-500">
              "Small steps today build big achievements tomorrow."
            </p>
          </>
        )}
      </div>

      <img
        src={hovered ? beeQuote : bee}
        alt="bee"
        className={`
          absolute right-6 top-6 w-40 transition-transform duration-500
          ${hovered ? "rotate-12 scale-110" : ""}
        `}
      />
    </div>
  

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        <div
          onClick={() => navigate("/tasks")}
          className="bg-yellow-300 rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-pointer hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            📝 Your Tasks
          </h3>
          <p className="text-gray-500 mt-2">
            View and manage your tasks.
          </p>
        </div>

        <div
          onClick={() => navigate("/ai")}
          className="bg-yellow-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-pointer hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            ✨ Break Task with AI
          </h3>
          <p className="text-gray-500 mt-2">
            Turn big goals into tiny wins.
          </p>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6 shadow-md border-2 border-dashed border-yellow-300 opacity-80">
          <h3 className="text-xl font-semibold text-gray-700">
            👥 Collaboration
          </h3>
          <p className="text-gray-500 mt-2">
            Work together (coming soon)
          </p>
        </div>
      </div>

      {/* Progress Section */}
<div className="mt-12 bg-white rounded-3xl p-8 shadow-md">
  <h3 className="text-xl font-semibold text-gray-800">
    Today’s Progress
  </h3>

  <div className="mt-4">
    <div className="h-3 bg-gray-200 rounded-full">
      <div
        className="h-3 bg-green-500 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>

    <p className="text-sm text-gray-500 mt-2">
      {completedCount} of {totalCount} tasks completed 🎉
    </p>
    {progress === 100 && (
  <p className="text-green-600 font-semibold mt-2">
     BeeBee is proud of you!
  </p>
)}
  </div>
</div>

</div>

  )
}