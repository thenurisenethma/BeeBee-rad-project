import Navbar from "../components/Navbar"
import TaskModal from "../components/TaskModal"
import { useState, useEffect } from "react"

export interface Task {
  id: string
  title: string
  due: string
  status: string
  assignedTo?: string
}

export default function Dashboard() {
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  useEffect(() => {
    if (!userId || !token) return

    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        const normalized: Task[] = data.map((t: any) => ({
          id: t._id,
          title: t.title,
          due: t.due,
          status: t.status,
          assignedTo: t.assignedTo || "",
        }))

        setTasks(normalized)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTasks()
  }, [userId, token])

  const handleSaveTask = async (task: Task) => {
    if (!token || !userId) return

    if (task.id) {
      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: task.title,
            due: task.due,
            status: task.status,
            assignedTo: task.assignedTo || "",
          }),
        })

        const updated = await res.json()

        if (!res.ok) {
          alert(updated.message || "Failed to update task")
          return
        }

        setTasks(prev =>
          prev.map(t => (t.id === task.id ? { ...t, ...updated, id: updated._id } : t))
        )
      } catch (err) {
        console.error(err)
        alert("Something went wrong while updating task")
      }
    }
    else {
      try {
        const res = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: task.title,
            due: task.due,
            status: task.status,
            assignedTo: task.assignedTo || "",
            userId,
          }),
        })

        const created = await res.json()

        if (!res.ok) {
          alert(created.message || "Failed to add task")
          return
        }

        setTasks(prev => [...prev, { ...created, id: created._id }])
      } catch (err) {
        console.error(err)
        alert("Something went wrong while adding task")
      }
    }

    setEditTask(null)
    setIsModalOpen(false)
  }

  const handleDeleteTask = async (id?: string) => {
    if (!token || !id) return

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.message || "Failed to delete task")
        return
      }

      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
      alert("Something went wrong while deleting task")
    }
  }
  const handleCompleteTask = async (id: string) => {
  if (!token) return

  const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "Completed" }),
  })

  const updated = await res.json()

  setTasks(prev =>
    prev.map(t =>
      t.id === id ? { ...t, status: "Completed" } : t
    )
  )
}


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button
            onClick={() => {
              setEditTask(null)
              setIsModalOpen(true)
            }}
            className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-600"
          >
            + Add Task
          </button>
        </div>

        <ul className="space-y-3 bg-white p-6 rounded-xl shadow">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex justify-between bg-gray-50 p-3 rounded"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">
                  Due: {task.due} | {task.status}
                  {task.assignedTo && ` | Assigned to: ${task.assignedTo}`}
                </p>
              </div>
              
              <div className="flex gap-2">
              {task.status !== "Completed" && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                className="px-4 py-2 bg-green-100 text-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition"
                >
                  Complete
                </button>
              )}

              <button
                onClick={() => {
                  setEditTask(task)
                  setIsModalOpen(true)
                }}
                className="px-4 py-2 bg-blue-100 text-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-4 py-2 bg-red-100 text-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition"
              >
                Delete
              </button>
            </div>

            </li>
          ))}
        </ul>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={handleSaveTask}
        editTask={editTask}
      />
    </div>
  )
}
