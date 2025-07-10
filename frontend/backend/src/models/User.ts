import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; 
  nombre: string;
  correo: string;
  tipoCuenta: "admin" | "mantenimiento" | "vigilancia";
  contraseña: string;
  telefono: string;
}

const userSchema = new Schema<IUser>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tipoCuenta: {
      type: String,
      required: true,
      enum: ["admin", "mantenimiento", "vigilancia"],
    },
    contraseña: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
