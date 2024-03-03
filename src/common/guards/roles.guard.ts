import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {

      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
   //console.log('==>', context.switchToHttp().getRequest()?.user)
   //console.log('user should contain data ==>', user)
    console.log('should return true for role==>', requiredRoles.some((role) => user.role?.includes(role)))
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}