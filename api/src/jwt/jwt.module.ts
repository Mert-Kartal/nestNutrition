import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
