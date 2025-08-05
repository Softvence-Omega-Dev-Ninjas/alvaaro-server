import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserSearchPayload } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get query parameters for filtering sellers
  @Post('all-sellers')
  findAllSellers(@Query() payload: UserSearchPayload) {
    const normalizedPayload = {
      ...payload,
      s_status:
        typeof payload.s_status === 'boolean'
          ? payload.s_status
            ? 'active'
            : 'inactive'
          : payload.s_status,
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
  async verifySeller(@Param('id') id: string) {
    return this.adminService.verifySeller(id);
  }
  // get all users and sellers
  @Get('all-users-sellers')
  findAllUsersAndSellers() {
    return this.adminService.findAllUsersAndSellers();
  }
}
