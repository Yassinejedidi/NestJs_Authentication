import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as config from 'config'
import { User } from 'src/enteties/user.entity';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:process.env.JWT_SECRET || config.get('jwt.secret'), // use your own secret key
    });
  }

 async validate(payload: JwtPayload): Promise<User> {
  const { username, role } = payload;
  const user = await this.userRepository.findOne({
    where: { username }
  });
  if (!user) {
    throw new UnauthorizedException();
  }

 
  user.role = role;

  return user;
}

  
}
