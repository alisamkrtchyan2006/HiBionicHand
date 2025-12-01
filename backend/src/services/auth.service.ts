import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../database/prisma.client';
import { ResponseUtil } from '../utils/response.util';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'editor' | 'user';
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly JWT_REFRESH_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-chars';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
    this.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (this.JWT_SECRET.length < 32) {
      console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for production!');
    }
  }

  async login(credentials: LoginCredentials): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      role: string;
    };
  }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(data: RegisterData): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      role: string;
    };
  }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'user',
        isActive: true,
      },
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as TokenPayload;

      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new access token
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      } as SignOptions);

      return { accessToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      throw error;
    }
  }
}

