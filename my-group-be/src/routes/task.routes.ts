import { Router, Request, Response } from "express"
import Task from "../models/Task"

const router = Router()

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})


router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, due, userId, assignedTo } = req.body;
    if (!title || !due || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = await Task.create({ title, due, userId, assignedTo });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, due, status, assignedTo } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, due, status, assignedTo },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deletedTask = await Task.findByIdAndDelete(id)
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({ message: "Task deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
})

router.post("/", async (req, res) => {
  const { title, due, userId, groupId, assignedTo } = req.body;

  const task = await Task.create({
    title,
    due,
    userId,
    groupId,
    assignedTo,
    status: "Pending",
  });

  res.status(201).json(task);
});


export default router
