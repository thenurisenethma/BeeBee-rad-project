import express from "express";
import { breakTask } from "../utils/gemini";
import Task from "../models/Task";

const router = express.Router();

router.post("/break-task", async (req, res) => {
  try {
    const title = req.body.title || req.body.task;
    const { due, userId, groupId, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title or task description is required" });
    }
    if (!userId || !due) {
      return res.status(400).json({ message: "userId and due date are required to save the task" });
    }

    // 1. Get the AI breakdown using the title
    const breakdown = await breakTask(title);

        if (!Array.isArray(breakdown)) {
        throw new Error("AI did not return valid task array");
        }
        
    // 2. Create the Task document including the AI sub-tasks
    const newTask = new Task({
      title,
      due,
      userId,
      groupId,
      assignedTo,
      status: "Pending",
      subTasks: breakdown.map((item: any) => ({
        title: item.title,
        estimated_minutes: item.estimated_minutes,
        isCompleted: false
      }))
    });

    // 3. Save to MongoDB
    const savedTask = await newTask.save();

    return res.status(201).json({
      message: "Task created with AI sub-tasks",
      task: savedTask,
    });
  } catch (err: any) {
    console.error("AI Save Error:", err.message);
    return res.status(500).json({ 
      message: "Failed to process AI task", 
      details: err.message 
    });
  }
});

export default router;