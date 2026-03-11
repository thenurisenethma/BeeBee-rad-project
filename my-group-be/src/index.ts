import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import connectDB from "./config/db"
import taskRoutes from "./routes/task.routes"
import aiRoutes from "./routes/ai.routes"

app.use("/api/tasks", taskRoutes)
app.use("/api/ai", aiRoutes)

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})