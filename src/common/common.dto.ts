import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FacebookCommonQuery { 

  @ApiProperty()
  @IsString()
  @IsOptional()
  accessToken: string

}