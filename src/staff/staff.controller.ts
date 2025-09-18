import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { StaffService } from './staff.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/constants/enum';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UploadImageInterceptor } from 'src/common/interceptors/upload-file.interceptor';
import { CreateStaffDto } from './dto/create-staff.dto';
import { FileSizeValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { UpdateStaffDto } from './dto/update.staff.dto';

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
    return await this.staffService.getProfile(request['user'].id);
  }

  @Get('/:staffId/profile')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async getStaffProfile(@Param('staffId') staffId: string) {
    return await this.staffService.getProfile(staffId);
  }

  @Post('/create')
  @UseInterceptors(UploadImageInterceptor('image'))
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async createStaff(
    @Body() createStaffDto: CreateStaffDto,
    @UploadedFile(FileSizeValidationPipe) file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return await this.staffService.createStaff(createStaffDto, request['user'].id, file);
  }

  @Delete('/:staffId')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('staffId') staffId: string) {
    return await this.staffService.deleteStaff(staffId);
  }

  @Put('/update')
  @UseInterceptors(UploadImageInterceptor('image'))
  async update(
    @Body() updateStaffDto: UpdateStaffDto,
    @UploadedFile(FileSizeValidationPipe) file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return await this.staffService.updateStaff(updateStaffDto, request['user'].id, file);
  }
}
