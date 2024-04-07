import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleNames } from './role-names.enum';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Role {
  @Prop({ type: String }) // Ensure type is defined for _id
  _id: string;

  @ApiProperty()
  @Prop()
  roleName: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
