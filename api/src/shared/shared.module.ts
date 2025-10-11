import { Module } from '@nestjs/common';
import { JwtGuard } from './guard/jwt.guard';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [JwtGuard],
  exports: [JwtGuard, JwtModule],
})
export class SharedModule {}
