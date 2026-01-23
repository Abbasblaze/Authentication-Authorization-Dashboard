import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use("/api/users", authRoutes);
app.use("/api/admin", adminRoutes);

connectDB();

app.listen(PORT, () => {
  console.log("Server Started at port 5000 ");
});
