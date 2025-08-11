import { Request, Response } from "express";
import User from "../models/User";
import { encryptionPassword, verifyPassword } from "../utils/encrytionPassword";
import { generateAccessToken } from "../utils/generateToken";
import Settings from "../models/Settings";
import Residente from "../models/Residentes";
import Zona from "../models/irrigation";
import axios from "axios";
import bcrypt, { hash } from 'bcryptjs';


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
      return res.status(404).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await verifyPassword(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
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


import { mysqlPool } from '../config/mysql';


export const getResidentes = async (_req: Request, res: Response) => {
  const [rows] = await mysqlPool.query(`
    SELECT 
      r.id,
      CONCAT(r.nombre, ' ', r.apellido1, ' ', r.apellido2) AS nombre_completo,
      u.username,
      res.n_residencia,
      r.status
    FROM residentes r
    LEFT JOIN usuarios u ON u.residente = r.id
    LEFT JOIN residencias res ON res.usuario = u.id
  `);
  res.json(rows);
};

export const createResidente = async (req: Request, res: Response) => {
  const { nombre, apellido1, apellido2 } = req.body;
  await mysqlPool.query(
    'INSERT INTO residentes (nombre, apellido1, apellido2, status) VALUES (?, ?, ?, "Activo")',
    [nombre, apellido1, apellido2]
  );
  res.json({ message: 'Residente registrado' });
};

export const deactivateResidente = async (req: Request, res: Response) => {
  const { id } = req.params;
  await mysqlPool.query(
    'UPDATE residentes SET status = "Inactivo" WHERE id = ?',
    [id]
  );
  res.json({ message: 'Residente dado de baja' });
};

export const assignUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const [existing] = await mysqlPool.query(
    'SELECT id FROM usuarios WHERE residente = ?',
    [id]
  );

  if ((existing as any[]).length > 0) {
    await mysqlPool.query(
      'UPDATE usuarios SET username = ?, password = ? WHERE residente = ?',
      [username, hashed, id]
    );
  } else {
    await mysqlPool.query(
      'INSERT INTO usuarios (username, password, residente) VALUES (?, ?, ?)',
      [username, hashed, id]
    );
  }

  res.json({ message: 'Usuario asignado' });
};

export const assignResidencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { numero } = req.body;

  const [usuario] = await mysqlPool.query(
    'SELECT id FROM usuarios WHERE residente = ?',
    [id]
  );
  const usuarioId = (usuario as any[])[0]?.id;

  if (!usuarioId) {
    return res.status(400).json({ error: 'Usuario no asignado' });
  }

  const [existing] = await mysqlPool.query(
    'SELECT id FROM residencias WHERE usuario = ?',
    [usuarioId]
  );

  if ((existing as any[]).length > 0) {
    await mysqlPool.query(
      'UPDATE residencias SET n_residencia = ? WHERE usuario = ?',
      [numero, usuarioId]
    );
  } else {
    await mysqlPool.query(
      'INSERT INTO residencias (n_residencia, usuario) VALUES (?, ?)',
      [numero, usuarioId]
    );
  }

  res.json({ message: 'Residencia asignada' });
};

export const assignControl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { control, pin, topic } = req.body;

  const [usuario] = await mysqlPool.query(
    'SELECT id FROM usuarios WHERE residente = ?',
    [id]
  );
  const usuarioId = (usuario as any[])[0]?.id;

  const [residencia] = await mysqlPool.query(
    'SELECT id FROM residencias WHERE usuario = ?',
    [usuarioId]
  );
  const residenciaId = (residencia as any[])[0]?.id;

  if (!residenciaId) {
    return res.status(400).json({ error: 'Residencia no encontrada' });
  }

  await mysqlPool.query(
    'INSERT INTO controles (id_residencia, control, pin, topic) VALUES (?, ?, ?, ?)',
    [residenciaId, control, pin, topic]
  );

  res.json({ message: 'Control asignado' });
};

// src/controllers/reservacion.controller.ts

import Resident from "../models/Residentes";
export const getReservaciones = async (_req: Request, res: Response) => {
  const [rows] = await mysqlPool.query("SELECT * FROM reservaciones");
  res.json(rows);
};

export const crearReservacion = async (req: Request, res: Response) => {
  const { residente, fecha, espacio } = req.body;
  await mysqlPool.query(
    "INSERT INTO reservaciones (residente, fecha, espacio, estado) VALUES (?, ?, ?, 'reservada')",
    [residente, fecha, espacio]
  );
  res.json({ message: "Reservación creada" });
};

export const cancelarReservacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  await mysqlPool.query(
    "UPDATE reservaciones SET estado = 'cancelada' WHERE id = ?",
    [id]
  );
  res.json({ message: "Reservación cancelada" });
};

export const marcarRealizada = async (req: Request, res: Response) => {
  const { id } = req.params;
  await mysqlPool.query(
    "UPDATE reservaciones SET estado = 'realizada' WHERE id = ?",
    [id]
  );
  res.json({ message: "Reservación marcada como realizada" });

};

export const getResidentsEntrada = async (req: Request, res: Response) => {
  try {
    const resi = await Resident.find({ tipo: "Entrada" }).sort({ fecha: -1, hora: -1 });
    res.json(resi);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

// Crear residente tipo Entrada con UID normalizado a mayúsculas
export const createResidentEntrada = async (req: Request, res: Response) => {
  try {
    const { nombre, casa, telefono, fecha, hora, uid } = req.body;
    const nuevo = new Resident({ 
      nombre, 
      casa, 
      telefono, 
      tipo: "Entrada", 
      fecha, 
      hora, 
      uid: uid?.toUpperCase()  // forzar mayúsculas
    });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

// Obtener residentes tipo Salida
export const getResidentsSalida = async (req: Request, res: Response) => {
  try {
    const resi = await Resident.find({ tipo: "Salida" }).sort({ fecha: -1, hora: -1 });
    res.json(resi);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

// Crear residente tipo Salida con UID normalizado a mayúsculas
export const createResidentSalida = async (req: Request, res: Response) => {
  try {
    const { nombre, casa, telefono, fecha, hora, uid } = req.body;
    const nuevo = new Resident({ 
      nombre, 
      casa, 
      telefono, 
      tipo: "Salida", 
      fecha, 
      hora, 
      uid: uid?.toUpperCase()  // forzar mayúsculas
    });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

// Nuevo: obtener todos los UIDs guardados (entrada y salida)
export const getAllUIDs = async (req: Request, res: Response) => {
  try {
    // Obtener solo el campo UID y tipo, sin otros datos
    const uids = await Resident.find({}, { uid: 1, tipo: 1, _id: 0 }).sort({ tipo: 1, uid: 1 });
    res.json(uids);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

// src/controllers/aut.controller.ts

import Sensor from '../models/Sensor';

export const saveSensorData = async (req: Request, res: Response) => {
  try {
    const sensor = new Sensor(req.body);
    await sensor.save();
    res.status(201).json({ message: 'Datos guardados', sensor });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar datos' });
  }
};

export const getSensorData = async (req: Request, res: Response) => {
  try {
    const sensores = await Sensor.find().sort({ fecha: -1 });
    res.json(sensores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, telefono, contraseña } = req.body;

    const updateFields: Partial<{
      nombre: string;
      correo: string;
      telefono: string;
      contraseña: string;
    }> = {
      nombre,
      correo,
      telefono,
    };

    if (contraseña && contraseña.trim() !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
      updateFields.contraseña = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-contraseña"); // No devolver contraseña en la respuesta

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno al actualizar" });
  }
};