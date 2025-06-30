import { Schema, model, Document } from "mongoose";

export interface IZona extends Document {
  nombre: string;
  humedad: string;
  temperatura: string;
  imagen: string;
  riegoActivo: boolean;
}

const zonaSchema = new Schema<IZona>({
  nombre: { type: String, required: true },
  humedad: { type: String, required: true },
  temperatura: { type: String, required: true },
  imagen: { type: String, required: true },
  riegoActivo: { type: Boolean, default: false }
}, { timestamps: true });

export default model<IZona>("Zona", zonaSchema);
