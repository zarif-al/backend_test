import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
