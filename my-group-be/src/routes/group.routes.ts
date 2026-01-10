import { Router } from "express";
import Group from "../models/Group";

const router = Router();

router.get("/:groupId/members", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "name email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group.members);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
