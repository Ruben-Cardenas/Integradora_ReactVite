import Jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || "secret1234utd";

export const generateAccessToken = (userId: string, role: string) => {
  return Jwt.sign(
    { userId, role }, // agrega role en el payload si lo necesitas
    ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};
