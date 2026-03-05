import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MaintenanceService } from './maintenance.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post('/create')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
    @Req() request: Request,
  ) {
    return await this.maintenanceService.create(
      createMaintenanceDto,
      request['user'].id,
    );
  }
}
