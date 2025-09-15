import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  async getStaffProfile(@Param('staffId') staffId: string) {
    return this.staffService.getProfile(staffId);
  }

  @Post('/create')
  @UseInterceptors(UploadImageInterceptor('image'))
  async createStaff(
    @Body() createStaffDto: CreateStaffDto,
    @UploadedFile(FileSizeValidationPipe) file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const adminId = request['user'].id;
    return this.staffService.createStaff(createStaffDto, adminId, file);
  }
}
