import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async dashboardStats() {
    return await this.dashboardService.dashboardStats();
  }
}
