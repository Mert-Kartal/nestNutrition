import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
export const Roles = (...Roles: Role[]) => SetMetadata('role', Roles);
