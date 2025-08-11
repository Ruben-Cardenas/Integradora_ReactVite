import express from "express";
import cors from "cors";
import morgan from "morgan"; 
import connectBase from "./config/db";
import authRoutes from "./routes/auth.routes";

import mqtt from "mqtt";
import Resident from "./models/Residentes";

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


// ================= MQTT CONFIGURACIÓN ==================
const mqtt_server = "mqtt://192.168.86.28"; // Dirección del broker
const client = mqtt.connect(mqtt_server);

client.on("connect", () => {
  console.log("📡 MQTT conectado");
  client.subscribe("fraccionamiento/uid", (err) => {
    if (err) console.error("❌ Error al suscribir:", err);
    else console.log("🟢 Suscrito a: fraccionamiento/uid");
  });
});

client.on("message", async (topic, message) => {
  if (topic === "fraccionamiento/uid") {
    let uidReceived = "";
    try {
      const payload = JSON.parse(message.toString());
      uidReceived = payload.uid?.toUpperCase().trim();
    } catch (err) {
      console.error("❌ Error al parsear UID JSON:", err);
      return;
    }

    if (!uidReceived) {
      console.warn("⚠️ UID vacío o inválido");
      return;
    }

    console.log(`🔍 UID recibido: ${uidReceived}`);

    try {
      const residente = await Resident.findOne({ uid: uidReceived });
      if (!residente) {
        console.log(`❌ Acceso denegado - UID no encontrado: ${uidReceived}`);
        client.publish("fraccionamiento/acceso", `Acceso denegado - UID ${uidReceived}`);
      } else {
        console.log(`✅ Acceso permitido para: ${residente.nombre}, tipo: ${residente.tipo}`);
        client.publish(
          "fraccionamiento/acceso",
          `Acceso permitido - ${residente.tipo} - ${residente.nombre}`
        );
      }
    } catch (error) {
      console.error("❌ Error buscando UID en DB:", error);
      client.publish("fraccionamiento/acceso", "Error interno del servidor");
    }
  }
});
