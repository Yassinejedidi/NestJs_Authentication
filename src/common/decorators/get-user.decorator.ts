import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/enteties/user.entity';


export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    // Log the user object
    return request.user;
  },
);




