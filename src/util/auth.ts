import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

// Tipo personalizado para el payload del JWT
interface CustomJwtPayload extends JwtPayload {
  role?: string;
  userId?: number; // Otras propiedades que estés utilizando
}

// Función para generar un token
export const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

// Función para verificar y decodificar un token
export const verifyToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Verificar si el token es un objeto de tipo JwtPayload
    if (typeof decoded !== "string") {
      return decoded as CustomJwtPayload; // Retornar como CustomJwtPayload si es un objeto
    }
    
    return null; // Si es una cadena, retornamos null
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return null;
  }
};
