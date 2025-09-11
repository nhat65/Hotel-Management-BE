import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { StaffService } from './staff.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/constants/enum';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('/')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async getAll() {
    return await this.staffService.getAll();
  }

  @Get('/profile')
  async getProfile(@Req() request: Request) {
    const staffId = request['user'].id;
    return this.staffService.getProfile(staffId);
  }

  @Get('/:staffId/profile')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async getStaffProfile(@Param('staffId') staffId: string){
    return this.staffService.getProfile(staffId)
  }
}
