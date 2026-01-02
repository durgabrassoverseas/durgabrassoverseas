import "dotenv/config"; // <-- MUST be FIRST
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
// import './utils/cron.js';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import finishRoutes from "./routes/finishRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });

// Default Route
app.get("/", (req, res) => {
  res.send("Hello From Server");
});

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", finishRoutes);
app.use("/api", itemRoutes);
app.use("/api", dashboardRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
