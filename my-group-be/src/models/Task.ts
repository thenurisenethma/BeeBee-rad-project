import mongoose, { Schema, Document } from "mongoose";

// Interface for individual sub-tasks
export interface ISubTask {
  title: string;
  estimated_minutes: number;
  isCompleted: boolean;
}

// Updated ITask interface to include subTasks and other fields from your routes
export interface ITask extends Document {
  title: string;
  due: string;
  status: "Pending" | "In Progress" | "Completed";
  userId: string;
  assignedTo?: string;
  groupId?: string;
  subTasks: ISubTask[]; // Added AI sub-tasks array
  createdAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  due: { type: String, required: true },
  userId: { type: String, required: true },
  assignedTo: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  groupId: { type: String },
  subTasks: [
    {
      title: { type: String, required: true },
      estimated_minutes: { type: Number, required: true },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITask>("Task", taskSchema);