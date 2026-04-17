import { useState } from "react"
import bee from "../assets/beebeeworking.png"
import type { Task, SubTask } from "../pages/TasksPage"

interface Props {
  userId: string
  onAddTask: (task: Task) => void
}

export default function BeeBeeAssistant({ userId, onAddTask }: Props) {
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("")
  const [loading, setLoading] = useState(false)

  const generateTask = async () => {
    if (!title || !due) {
      alert("Please enter task and due date")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:5000/api/ai/break-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, due, userId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      const newTask: Task = {
      id: data._id,
      title: data.title,
      due: data.due,
      status: data.status,
      assignedTo: data.assignedTo || "",
      subTasks: data.subTasks || [],
    };

    onAddTask(newTask);

      setTitle("")
      setDue("")
      alert("BeeBee created your task! 🐝")

    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto space-y-6 relative">

      <img
        src={bee}
        alt="BeeBee"
        className="w-40 absolute top-[-2rem] right-[-2rem] pointer-events-none hover:rotate-12 transition"
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-yellow-600">
          AI BeeBee
        </h2>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a big task..."
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Button */}
      <button
        onClick={generateTask}
        disabled={loading}
        className="
          w-full
          bg-yellow-400
          text-black
          font-semibold
          py-3
          rounded-xl
          transition-all
          duration-300
          hover:bg-black
          hover:text-yellow-300
          disabled:opacity-50
        "
      >
        {loading ? "🐝 BeeBee is thinking..." : "Generate with BeeBee"}
      </button>
    </div>
  )
}