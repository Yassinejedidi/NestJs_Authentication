import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module';
import { typeOrmConfig } from './database/typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AppController } from './app.controller';




@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,

  
  ],

  providers: [
    
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      
    },
  ],
 
 
    

})
export class AppModule {}
