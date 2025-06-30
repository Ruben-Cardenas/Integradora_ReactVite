import { Schema, model, Document } from "mongoose";

export interface IResidente extends Document {
  nombre: string;
  casa: string;
  telefono: string;
  tipo: "Entrada" | "Salida";
  fecha: Date;
}

const residenteSchema = new Schema<IResidente>(
  {
    nombre: { type: String, required: true },
    casa: { type: String, required: true },
    telefono: { type: String, required: true },
    tipo: { type: String, enum: ["Entrada", "Salida"], required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 👇 ESTE EXPORT ES OBLIGATORIO
export default model<IResidente>("Residente", residenteSchema);
