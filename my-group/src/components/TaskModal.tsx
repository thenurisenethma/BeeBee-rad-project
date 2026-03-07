import { useEffect, useState } from "react"
import type { Task } from "../pages/TasksPage"

interface Props {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  onSave: (task: Task) => Promise<void>
  editTask: Task | null
}

export default function TaskModal({
  isOpen,
  setIsOpen,
  onSave,
  editTask,
}: Props) {
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("")
  const [assignedTo, setAssignedTo] = useState("")

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDue(editTask.due)
      setAssignedTo(editTask.assignedTo || "")
    } else {
      setTitle("")
      setDue("")
      setAssignedTo("")
    }
  }, [editTask])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !due) {
      alert("Please fill all fields")
      return
    }

    const task: Task = {
      id: editTask?.id ?? "",  
      title,
      due,
      status: editTask?.status || "Pending",
      assignedTo,
    }

    await onSave(task)

    setTitle("")
    setDue("")
    setAssignedTo("")
    setIsOpen(false)
  }

 return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    
    <div className="
      w-full max-w-md 
      bg-white 
      rounded-3xl 
      shadow-2xl 
      p-8 
      space-y-6 
      relative
      animate-[fadeIn_.2s_ease-in-out]
    ">
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 text-center">
        {editTask ? "Edit Task 🐝" : "Add New Task ✨"}
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          className="
            w-full 
            px-4 py-3 
            rounded-xl 
            border-2 border-yellow-200 
            focus:outline-none 
            focus:ring-2 
            focus:ring-yellow-300 
            transition
          "
        />

        <input
          type="date"
          value={due}
          onChange={e => setDue(e.target.value)}
          className="
            w-full 
            px-4 py-3 
            rounded-xl 
            border-2 border-yellow-200 
            focus:outline-none 
            focus:ring-2 
            focus:ring-yellow-300 
            transition
          "
        />

        <input
          type="text"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          placeholder="Assign to (optional)"
          className="
            w-full 
            px-4 py-3 
            rounded-xl 
            border-2 border-yellow-200 
            focus:outline-none 
            focus:ring-2 
            focus:ring-yellow-300 
            transition
          "
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              px-5 py-2 
              rounded-xl 
              border 
              border-gray-300 
              text-gray-600 
              hover:bg-gray-100 
              transition
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              px-5 py-2 
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
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)
}
