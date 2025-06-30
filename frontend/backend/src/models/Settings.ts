import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  notificaciones: { type: Boolean, default: false },
  tema: { type: String, enum: ["Oscuro", "Claro"], default: "Oscuro" },
  idioma: { type: String, enum: ["Español", "Inglés"], default: "Español" },
});

export default mongoose.model("Settings", SettingsSchema);
