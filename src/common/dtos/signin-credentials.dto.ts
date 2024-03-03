import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class SingCredentialsDto {
  @IsString()
  username: string;
  
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;
  }
  