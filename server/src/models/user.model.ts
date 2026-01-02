import { db } from '../config/db.config';
import type {
  User,
  RegisterDTO
} from '../types/auth.type';

export class UserModel {

  static async create(userData: RegisterDTO & { password_hash: string }): Promise<User | null> {
    const [user] = await db<User[]>`
      INSERT INTO users (name, email, password_hash)
      VALUES (${userData.name}, ${userData.email}, ${userData.password_hash})
      RETURNING *
    `;
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [user] = await db<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `;
    return user || null;
  }

  static async findById(id: number): Promise<User | null> {
    const [user] = await db<User[]>`
      SELECT * FROM users WHERE id = ${id}
    `;
    return user || null;
  }

  static async emailExists(email: string): Promise<boolean> {
    const [result] = await db<[{ exists: boolean }]>`
      SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email})
    `;
    return result.exists;
  }

  static async updatePassword(userId: number, password_hash: string): Promise<void> {
    await db`
      UPDATE users 
      SET password_hash = ${password_hash}
      WHERE id = ${userId}
    `;
  }

  static async getAllUsers(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await db<User[]>`
      SELECT id, name, email, created_at FROM users
      ORDER BY created_at DESC
    `;
    return users;
  }

  static async deleteUser(userId: number): Promise<void> {
    await db`
      DELETE FROM users WHERE id = ${userId}
    `;
  }
}
