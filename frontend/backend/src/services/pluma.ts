import mqtt from 'mqtt';
import mongoose, { Schema, Document } from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/integradoraBD'; // Ajusta si es necesario
const MQTT_BROKER_URL = 'mqtt://192.168.1.76';               // IP de tu broker MQTT
const MQTT_TOPIC = 'fraccionamiento/residentes';

// Interfaz TypeScript para documento residente
interface IResidente extends Document {
  _id: string;
  nombre: string;
  casa: string;
  telefono: string;
  fecha: Date;
  hora: string;
  tipo: string;
  uid: string;
  __v: number;
}

// Esquema Mongoose
const ResidenteSchema = new Schema<IResidente>({
  _id: { type: String, required: true },
  nombre: { type: String, required: true },
  casa: { type: String, required: true },
  telefono: { type: String, required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  tipo: { type: String, required: true },
  uid: { type: String, required: true },
  __v: { type: Number, required: true, default: 0 },
});

// Modelo
const Residente = mongoose.model<IResidente>('Residente', ResidenteSchema);

async function main() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB con Mongoose');

    // Conectar a MQTT
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
      console.log('✅ Conectado a MQTT');
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Error suscribiéndose al tópico MQTT:', err);
        } else {
          console.log(`Suscrito al tópico: ${MQTT_TOPIC}`);
        }
      });
    });

    client.on('message', async (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          const data = JSON.parse(message.toString());
          const tipo = data.tipo?.toLowerCase();

          let documento: IResidente;

          if (tipo === 'entrada') {
            documento = new Residente({
              _id: '687ecaab24058970c1914045',
              nombre: 'Manuel',
              casa: '112',
              telefono: '6182127758',
              fecha: new Date('2025-07-21T00:00:00.000Z'),
              hora: '17:14',
              tipo: 'Entrada',
              uid: 'AB3MBB23', 
              __v: 0,
            });
          } else if (tipo === 'salida') {
            documento = new Residente({
              _id: '687ec6c224058970c191403e',
              nombre: 'bernardo',
              casa: '112',
              telefono: '6182127760',
              fecha: new Date('2025-07-21T00:00:00.000Z'),
              hora: '17:01',
              tipo: 'Salida',
              uid: 'AB3MBB55',
              __v: 0,
            });
          } else {
            // Si no es entrada o salida, guarda datos recibidos con fecha actual
            documento = new Residente({
              ...data,
              fecha: new Date(),
              __v: 0,
            });
          }

          // Insertar o actualizar con upsert
          const result = await Residente.findByIdAndUpdate(
            documento._id,
            documento,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          console.log('Documento guardado o actualizado:', result?._id);
        } catch (error) {
          console.error('Error procesando mensaje MQTT:', error);
        }
      }
    });

    client.on('error', (err) => {
      console.error('Error MQTT:', err);
    });
  } catch (err) {
    console.error('Error en main:', err);
  }
}

main();
