import jwt from "jsonwebtoken";

// /src/utils/jwt.utils.ts

const JWT_SECRET = process.env.JWT_SECRET || "random-long-jwt-secret";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
