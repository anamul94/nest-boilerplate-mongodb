import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { User, UserSchema } from './entities/user.entity';
import { Role, RoleSchema } from './entities';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
