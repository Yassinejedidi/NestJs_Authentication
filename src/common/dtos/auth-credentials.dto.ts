import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

    
    @IsString()
   username:string;

   @IsString()
   @MinLength(4)
   @MaxLength(20)
  
   password: string;
   @IsString()
   role: string;

}