import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.entity';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { RoleNames } from './role-names.enum';

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ type: Role, ref: 'Role', enum: [RoleNames.ADMIN, RoleNames.USER] })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
