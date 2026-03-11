import BeeBeeAssistant from "../components/BeeBeeAssistant"
import Navbar from "../components/Navbar"

export default function AIPage() {

  const userId = localStorage.getItem("userId") || ""

  const refreshTasks = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">

  <div className="flex items-center gap-3 mb-4">
    <h1 className="text-3xl font-bold text-yellow-600">
      BeeBee AI Task Generator ⚙️
    </h1>
  </div>

  <p className="text-gray-500 mb-6">
    Enter a big task and BeeBee will break it into smaller steps.
  </p>

 <BeeBeeAssistant
  userId={userId}
  onAddTask={() => refreshTasks()}
/>

</div>

    </div>
  )
}