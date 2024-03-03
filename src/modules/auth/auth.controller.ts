import { Body, Controller,Patch, Inject, Post, Get, Param,NotFoundException, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/enteties/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/enums/role.enum';
import { SingCredentialsDto } from 'src/common/dtos/signin-credentials.dto';


@Controller('users')
export class AuthController {
    constructor( 
        @Inject(AuthService)
        private authService: AuthService,
     ){}

 

@Public()
  @Post('auth')
  async sign(@Body() authCredentialsDto: SingCredentialsDto): Promise<{ accesToken: string, role: string, username:string}> {
    const { username, password } = authCredentialsDto;
    console.log(authCredentialsDto)

    try {
      const { accesToken, role } = await this.authService.SignIn(username, password);
      return { accesToken,role, username };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


    
  }
  
  



