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

export default function TasksPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-yellow-50">     
   <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-yellow-600">
            Your Tasks
          </h2>
          <p className="text-sm text-gray-500">
            Let BeeBee handle the details 🐝
          </p>
        </div>

        <button
          onClick={() => {
            setEditTask(null)
            setIsModalOpen(true)
          }}
          className="
            px-5 py-3 
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
          + Add Task
        </button>
      </div>
          {tasks.length === 0 && (
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <p className="text-gray-500 text-lg">
                No tasks yet… BeeBee is waiting 🐝💛
              </p>
            </div>
          )}
        <ul className="space-y-3 bg-white p-6 rounded-xl shadow">
          {tasks.map(task => (
            <li
              key={task.id}
              className="
                flex flex-col md:flex-row 
                md:justify-between 
                md:items-center 
                bg-white 
                p-5 
                rounded-2xl 
                shadow-md 
                hover:shadow-lg 
                transition
              "
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {task.title}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Due: {task.due} • {task.status}
                  {task.assignedTo && ` • Assigned to: ${task.assignedTo}`}
                </p>
              </div>
              
              <div className="flex gap-2">
              {task.status !== "Completed" && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                    className="
                      px-4 py-2 
                      rounded-xl 
                      bg-green-100 
                      text-green-600 
                      font-medium
                      hover:bg-black 
                      hover:text-green-300 
                      transition
                    "                >
                  Complete
                </button>
              )}

              <button
                onClick={() => {
                  setEditTask(task)
                  setIsModalOpen(true)
                }}
                  className="
                    px-4 py-2 
                    rounded-xl 
                    bg-blue-200 
                    text-blue-600 
                    font-medium
                    hover:bg-black 
                    hover:text-blue-300 
                    transition
                  "              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteTask(task.id)}
                  className="
                    px-4 py-2 
                    rounded-xl 
                    bg-red-100 
                    text-red-600 
                    font-medium
                    hover:bg-black
                    hover:text-red-200 
                    transition
                  "              >
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
