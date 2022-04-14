import { Module } from '@nestjs/common';
import { AppService } from '@/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/entities/users/users.module';
import * as connectionOptions from '@/ormconfig';

const modules = [UsersModule];

@Module({
  imports: [TypeOrmModule.forRoot(connectionOptions), ...modules],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
