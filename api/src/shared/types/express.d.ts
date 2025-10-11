import { Role } from '@prisma/client';
export interface JwtPayload {
  userId: string;
  role: Role;
  jti?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
