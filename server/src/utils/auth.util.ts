import jwt,  {type Secret} from 'jsonwebtoken';
import { JWTPayload } from '../types/auth.type';
import { env } from '../config/env';
const JWT_SECRET = env.JWT_SECRET ;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;

export  class JWTUtil {
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}