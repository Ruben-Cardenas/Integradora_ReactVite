import mqtt from 'mqtt';
import mongoose from 'mongoose';

// ✅ Conexión a MongoDB (nombre de base en minúsculas para evitar errores)
mongoose.connect('mongodb://localhost:27017/integradoraBD')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// ✅ Esquema y modelo de sensor
const SensorSchema = new mongoose.Schema({
  temperatura_ambiente: Number,
  temperatura_suelo: Number,
  fecha: { type: Date, default: Date.now },
});

const Sensor = mongoose.model('Sensor', SensorSchema);

// ✅ Conexión al broker MQTT
const client = mqtt.connect('mqtt://192.168.86.21'); // Ajusta IP si tu broker cambia

client.on('connect', () => {
  console.log('✅ Conectado al broker MQTT');
  client.subscribe('sensores/temperatura', (err) => {
    if (err) {
      console.error('❌ Error al suscribirse al topic:', err.message);
    } else {
      console.log('📡 Suscrito al topic: sensores/temperatura');
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const nuevoSensor = new Sensor(data);
    await nuevoSensor.save();

    console.log('📥 Datos guardados en MongoDB:', data);
  } catch (err) {
    console.error('❌ Error al procesar mensaje MQTT:', err);
  }
});
