import express from "express";
import cors from "cors";
import morgan from "morgan"; 
import connectBase from "./config/db";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 

connectBase();

app.use("/api", authRoutes);


app.get("/", (_req, res) => {
  res.send("Servidor backend funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
