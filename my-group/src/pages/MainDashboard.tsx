import { useNavigate } from "react-router-dom"
import bee from "../assets/bee logo.png"

export default function MainDashboard() {
  const navigate = useNavigate()

  const username = localStorage.getItem("username") || "Bee"

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")

  const completedCount = tasks.filter(
    (task: any) => task.status === "Completed"
  ).length

  const totalCount = tasks.length

  const progress =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">

      {/*Welcome  */}
      <div className="bg-black rounded-3xl p-8 shadow-md relative overflow-hidden">
        <h2 className="text-3xl font-bold text-yellow-600">
          Hi {username} 
        </h2>
        <p className="text-yellow-200 mt-2">
          Let’s make today productive and sweet ✨
        </p>

        <img
          src={bee}
          alt="bee"
          className="absolute right-6 top-6 w-40 opacity-100"
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
              className="h-3 bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {completedCount} of {totalCount} tasks completed 🎉
          </p>
        </div>
      </div>
    </div>
  )
}