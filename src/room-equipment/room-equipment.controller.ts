import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoomEquipmentService } from './room-equipment.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { RoomEquipmentDto } from './dto/room-equipment.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { EquipmentStatus } from 'src/constants/enum';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('room-equipment')
@UseGuards(JwtAuthGuard)
export class RoomEquipmentController {
  constructor(private readonly roomEquipmentService: RoomEquipmentService) {}

  @Post('/create')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() roomEquipmentDto: RoomEquipmentDto) {
    return await this.roomEquipmentService.create(roomEquipmentDto);
  }

  @Get('/:status')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async getEquipments(@Param('status') status: EquipmentStatus) {
    return await this.roomEquipmentService.getEquipments(status);
  }

  @Put('/:equipmentId/update')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async update(
    @Param('equipmentId') equipmentId: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return await this.roomEquipmentService.update(
      updateEquipmentDto,
      equipmentId,
    );
  }
}
