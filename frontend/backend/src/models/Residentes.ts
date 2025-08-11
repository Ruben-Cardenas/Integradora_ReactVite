import { Schema, model, Document } from "mongoose";

export interface IResidente extends Document {
  nombre: string;
  casa: string;
  telefono: string;
  fecha: Date;
  hora: string;
  tipo: "Entrada" | "Salida";
  uid: string;
}

const residenteSchema = new Schema<IResidente>({
  nombre: { type: String, required: true },
  casa: { type: String, required: true },
  telefono: { type: String, required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  tipo: { type: String, enum: ["Entrada", "Salida"], required: true },
  uid: { type: String, required: true, unique: true },
}, {
  collection: "residentes",
  timestamps: false,
});

export default model<IResidente>("Residente", residenteSchema);
