import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { JwtModule } from '@nestjs/jwt';
import { Account } from 'src/entities/account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Account, RefreshToken]), JwtModule.register({})],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
