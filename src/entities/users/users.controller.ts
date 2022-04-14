import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
