import mongoose from "mongoose";

const connectBase = async (): Promise<void> => {
  const mongoUri = "mongodb://localhost:27017/integradoraBD"; // URI fija

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Conectado a MongoDB correctamente");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1); // Detiene el servidor si falla la conexión
  }
};

export default connectBase;
