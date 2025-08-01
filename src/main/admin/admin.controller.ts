import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserSearchPayload } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get query parameters for filtering sellers

  @Get('all-sellers')
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
  // get all users and sellers
  @Get('all-users-sellers')
  findAllUsersAndSellers() {
    return this.adminService.findAllUsersAndSellers();
  }
  // get total amount monthwise
  @Get('total-amount')
  findTotalAmount() {
    // This method is not implemented in the provided code
    return this.adminService.findTotalAmount();
  }
}
