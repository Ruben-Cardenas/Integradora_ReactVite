import { Request, Response } from "express";
import User from "../models/User";
import { encryptionPassword, verifyPassword } from "../utils/encrytionPassword";
import { generateAccessToken } from "../utils/generateToken";
import Settings from "../models/Settings";
import Residente from "../models/Residentes";
import Zona from "../models/irrigation";
import axios from "axios";
import bcrypt from 'bcryptjs';


export const saveUser = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, tipoCuenta, contraseña, telefono } = req.body;

    if (!nombre || !correo || !tipoCuenta || !contraseña || !telefono) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await encryptionPassword(contraseña);

    const newUser = new User({
      nombre,
      correo,
      tipoCuenta,
      contraseña: hashedPassword,
      telefono,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({ message: "Usuario guardado", user: savedUser });
  } catch (error) {
    console.error("Error guardando usuario:", error);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios.", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await verifyPassword(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generateAccessToken(user._id.toString(), user.tipoCuenta);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        tipoCuenta: user.tipoCuenta,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const saveSettings = async (req: Request, res: Response) => {
  try {
    const { notificaciones, tema, idioma } = req.body;
    const config = await Settings.create({ notificaciones, tema, idioma });
    res.status(201).json(config);
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    res.status(500).json({ message: "Error al guardar configuración" });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const config = await Settings.findOne().sort({ _id: -1 }); // última
    res.json(config);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración" });
  }
};

// Obtener todas las zonas
export const getZonas = async (_req: Request, res: Response) => {
  try {
    const zonas = await Zona.find();
    res.json(zonas);
  } catch (error) {
    console.error("Error al obtener zonas:", error);
    res.status(500).json({ message: "Error al obtener zonas" });
  }
};

export const activarRiego = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const zona = await Zona.findById(id);
    if (!zona) return res.status(404).json({ message: "Zona no encontrada" });

    // URL del ESP32 (deberías parametrizar esta IP)
    const esp32Url = `http://192.168.1.X:80/activar_riego`;

    // Llamada HTTP al ESP32 para activar el riego
    await axios.post(esp32Url, { zona: zona.nombre });

    zona.riegoActivo = true;
    await zona.save();

    res.json({ message: `Riego activado en ${zona.nombre}` });
  } catch (error) {
    console.error("Error al activar riego:", error);
    res.status(500).json({ message: "Error al activar riego" });
  }
};

export const getDashboardData = async (_req: Request, res: Response) => {
  try {
    // Últimas 4 entradas y salidas
    const entradas = await Residente.find({ tipo: "Entrada" }).sort({ fecha: -1 }).limit(4);
    const salidas = await Residente.find({ tipo: "Salida" }).sort({ fecha: -1 }).limit(4);

    // Consulta todas las zonas (irrigation)
    const zonas = await Zona.find();

    // Construir datos de humedad y temperatura
    const humedad = zonas.map((zona) => ({
      area: zona.nombre,
      valor: zona.humedad,
    }));

    const temperatura = zonas.map((zona) => ({
      area: zona.nombre,
      valor: zona.temperatura,
    }));

    // Últimos 4 residentes registrados como "filtraciones"
    const filtraciones = await Residente.find()
      .sort({ fecha: -1 })
      .limit(4)
      .select("casa nombre telefono");

    const data = {
      entradas: entradas.map((e) => ({
        nombre: e.nombre,
        hora: new Date(e.fecha).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      salidas: salidas.map((s) => ({
        nombre: s.nombre,
        hora: new Date(s.fecha).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      humedad,
      temperatura,
      filtraciones: filtraciones.map((f) => ({
        casa: f.casa,
        nombre: f.nombre,
        telefono: f.telefono,
      })),
    };

    res.json(data);
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    res.status(500).json({ message: "Error al obtener datos del dashboard" });
  }
};



import { mysqlPool } from '../config/mysql';


// GET /residentes
export const getResidentes = async (_req: Request, res: Response) => {
  const [rows] = await mysqlPool.query('SELECT * FROM residentes');
  res.json(rows);
};

// POST /residentes
export const createResidente = async (req: Request, res: Response) => {
  const { name, houseNumber } = req.body;
  await mysqlPool.query(
    'INSERT INTO residentes (name, houseNumber, status) VALUES (?, ?, "Activo")',
    [name, houseNumber]
  );
  res.json({ message: 'Residente registrado' });
};

// PUT /residentes/:id/deactivate
export const deactivateResidente = async (req: Request, res: Response) => {
  const { id } = req.params;
  await mysqlPool.query(
    'UPDATE residentes SET status = "Inactivo" WHERE id = ?',
    [id]
  );
  res.json({ message: 'Residente dado de baja' });
};

// PUT /residentes/:id/usuario
export const assignUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await mysqlPool.query(
    'UPDATE residentes SET username = ?, password = ? WHERE id = ?',
    [username, hashed, id]
  );
  res.json({ message: 'Usuario asignado' });
};

// PUT /residentes/:id/control
export const assignControl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { controlId, pin, topic } = req.body;
  await mysqlPool.query(
    'UPDATE residentes SET controlId = ?, pin = ?, topic = ? WHERE id = ?',
    [controlId, pin, topic, id]
  );
  res.json({ message: 'Control asignado' });
};

