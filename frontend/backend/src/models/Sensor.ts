// src/models/Sensor.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISensor extends Document {
  temperatura_ambiente: number;
  temperatura_suelo: number;
  fecha: Date;
}

const SensorSchema: Schema = new Schema({
  temperatura_ambiente: { type: Number, required: true },
  temperatura_suelo: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model<ISensor>('Sensor', SensorSchema);
