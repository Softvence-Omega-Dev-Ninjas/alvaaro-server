import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserSearchPayload } from './dto/create-admin.dto';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { VerificationStatusDto } from './dto/verficationStatus.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('admin')
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get query parameters for filtering sellers
  @Get('all-sellers')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findAllSellers(@Query() payload: UserSearchPayload) {
    const normalizedPayload = {
      ...payload,
      s_status:
        typeof payload.s_status === 'boolean'
          ? payload.s_status
            ? 'true'
            : 'false'
          : (payload.s_status as 'true' | 'false' | undefined),
    };
    return await this.adminService.findAllSellers(normalizedPayload);
  }
  // get total amount monthwise
  @Get('total-amount')
  async findTotalAmount() {
    return await this.adminService.findTotalAmount();
  }
  // seller verification by admin
  @Patch('verify-seller/:id')
  async verifySeller(
    @Param('id') id: string,
    @Body() status: VerificationStatusDto,
  ) {
    return await this.adminService.verifySeller(id, status);
  }
  // get all users and sellers
  @Get('all-users-sellers')
  async findAllUsersAndSellers() {
    return await this.adminService.findAllUsersAndSellers();
  }

  //! TODO: Implement total sales
  // delete seller
  @Delete('delete-seller/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteSeller(@Param('id') id: string) {
    return this.adminService.deleteSeller(id);
  }
  // block user
  @Post('block-user/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }
  // role change
  @Post('change-role/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: UpdateRoleDto, enum: UserRole })
  async changeUserRole(@Param('id') id: string, @Body() role: UpdateRoleDto) {
    return await this.adminService.updateUserRole(id, role);
  }
}
