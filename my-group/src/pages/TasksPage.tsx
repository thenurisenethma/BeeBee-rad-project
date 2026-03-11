import { useState, useEffect } from "react"
import Navbar from "../components/Navbar";
import bee from "../assets/bee logo.png"

const TaskModal = ({ isOpen, setIsOpen, onSave, editTask }: any) => {
  const [formData, setFormData] = useState({ title: "", due: "", status: "Pending", assignedTo: "" });

  useEffect(() => {
    if (editTask) {
      setFormData({ 
        title: editTask.title, 
        due: editTask.due, 
        status: editTask.status, 
        assignedTo: editTask.assignedTo || "" 
      });
    } else {
      setFormData({ title: "", due: "", status: "Pending", assignedTo: "" });
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-scaleIn">
        <h3 className="text-xl font-bold mb-4">{editTask ? "Edit Task" : "Add New Task"}</h3>
        <div className="space-y-4">
         <input
  type="text"
  placeholder="Task Title"
  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
/>

<input
  type="date"
  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
/>

<input
  type="text"
  placeholder="Assigned To"
  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
/>
          
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
          <button 
            onClick={() => onSave({ ...editTask, ...formData })}
            className="px-4 py-2 bg-yellow-400 rounded-lg font-bold"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export interface SubTask {
  title: string;
  estimated_minutes: number;
  isCompleted: boolean;
}

export interface Task {
  id: string
  title: string
  due: string
  status: string
  assignedTo?: string
  subTasks?: SubTask[]
}

function TasksPage() {
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

        const normalized: Task[] = Array.isArray(data) ? data.map((t: any) => ({
          id: t._id,
          title: t.title,
          due: t.due,
          status: t.status,
          assignedTo: t.assignedTo || "",
          subTasks: t.subTasks || []
        })) : [];

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
        if (!res.ok) throw new Error(updated.message)

        setTasks(prev =>
          prev.map(t => (t.id === task.id ? { ...t, ...updated, id: updated._id } : t))
        )
      } catch (err: any) {
        alert(err.message || "Failed to update task")
      }
    } else {
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
        if (!res.ok) throw new Error(created.message)

        setTasks(prev => [...prev, { ...created, id: created._id }])
      } catch (err: any) {
        alert(err.message || "Failed to add task")
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
      if (!res.ok) throw new Error("Delete failed")
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleCompleteTask = async (id: string) => {
    if (!token) return
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Completed" }),
    })

    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Completed" } : t))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-stone-50 to-yellow-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-yellow-600">Your Tasks</h2>
            <p className="text-sm text-gray-500">Let BeeBee handle the details 🐝</p>
          </div>
          <button
            onClick={() => { setEditTask(null); setIsModalOpen(true); }}
            className="px-5 py-3 rounded-xl bg-yellow-300 text-black font-semibold hover:bg-black hover:text-yellow-300 transition-all duration-300"
          >
            + Add Task
          </button>
        </div>

     {tasks.length === 0 && (
  <div className="bg-white p-14 rounded-3xl shadow-sm border border-gray-100 text-center">
    
    <img
      src={bee}
      alt="BeeBee"
      className="w-24 mx-auto mb-4"
    />

    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No tasks yet
    </h3>

    <p className="text-gray-400">
      Add your first task and let BeeBee organize your work
    </p>

  </div>
)}

        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-400 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Due: {task.due} • Status: <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {task.status}
                    </span>
                    {task.assignedTo && ` • Assigned: ${task.assignedTo}`}
                  </p>

                  {task.subTasks && task.subTasks.length > 0 && (
                    <div className="mt-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">AI Suggested Steps:</h4>
                      <ul className="space-y-2">
                        {task.subTasks.map((sub, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                            <span className="flex-1">{sub.title}</span>
                            <span className="text-xs text-gray-400">{sub.estimated_minutes}m</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

            <div className="flex gap-2 flex-wrap">
            {task.status !== "Completed" && (
              <button
                onClick={() => handleCompleteTask(task.id)}
                className="px-3 py-1.5 rounded-lg bg-green-100 text-green-600 text-sm font-medium hover:bg-green-600 hover:text-white transition"
              >
                ✓ Done
              </button>
            )}

              <button
                onClick={() => { setEditTask(task); setIsModalOpen(true); }}
                className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white transition"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-sm font-medium hover:bg-red-600 hover:text-white transition"
              >
                🗑️ Delete
            </button>
            </div>
              </div>
            </div>
          ))}
        </div>
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

export default TasksPage;