import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Profile API is running" });
});
app.use("/api", profileRoutes);

app.use(errorHandler);

export default app;
