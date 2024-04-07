import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

@Schema()
export class Role {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @ApiProperty()
  @Prop()
  roleName: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
