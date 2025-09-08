import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserSearchPayload } from './dto/create-admin.dto';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { VerificationStatusDto } from './dto/verficationStatus.dto';

@Controller('admin')
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get query parameters for filtering sellers
  @Get('all-sellers')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  findAllSellers(@Query() payload: UserSearchPayload) {
    const normalizedPayload = {
      ...payload,
      s_status:
        typeof payload.s_status === 'boolean'
          ? payload.s_status
            ? 'true'
            : 'false'
          : (payload.s_status as 'true' | 'false' | undefined),
    };
    return this.adminService.findAllSellers(normalizedPayload);
  }
  // get total amount monthwise
  @Get('total-amount')
  findTotalAmount() {
    return this.adminService.findTotalAmount();
  }
  // seller verification by admin
  @Post('verify-seller/:id')
  async verifySeller(
    @Param('id') id: string,
    @Query('status') status: VerificationStatusDto,
  ) {
    return this.adminService.verifySeller(id, status);
  }
  // get all users and sellers
  @Get('all-users-sellers')
  findAllUsersAndSellers() {
    return this.adminService.findAllUsersAndSellers();
  }

  //! TODO: Implement total sales
  // delete seller
  @Post('delete-seller/:id')
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
}
