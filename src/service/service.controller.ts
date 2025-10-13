import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Get('/')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async getServices() {
    return await this.serviceService.getServices();
  }

  @Post('/create')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() request: Request,
  ) {
    return await this.serviceService.create(
      createServiceDto,
      request['user'].id,
    );
  }

  @Put('/:serviceId')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async update(
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() request: Request,
    @Param('serviceId') serviceId: string,
  ) {
    return await this.serviceService.update(
      updateServiceDto,
      request['user'].id,
      serviceId,
    );
  }

  @Delete('/:serviceId')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async delete(@Req() request: Request, @Param('serviceId') serviceId: string) {
    return await this.serviceService.delete(serviceId, request['user'].id);
  }
}
