import { NotFoundException, HttpException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/enteties/user.entity';
import * as ldap from 'ldapjs';
import { config, ldapAttributes } from 'src/ldap/config/config';
import * as nodemailer from 'nodemailer';
import { Role } from 'src/common/enums/role.enum';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';





@Injectable()
export class AuthService {
    private logger = new Logger('AuthService') 
    private readonly client: ldap.Client;
    private readonly baseDn: string;
     
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService:JwtService,
        
       
      ){this.client = ldap.createClient({
        url: config.ldapUrl,
      });
      this.baseDn = config.baseDn; }


      async getall(): Promise<User[]> {
        const result =await this.userRepository.find()
        return result 
      } 

      //auth using ldap 

      async authenticate(username: string, password: string): Promise<boolean> {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isEmail = regex.test(username);
        let cnValue: string;
      
        if (isEmail) {
          cnValue = username.split('@')[0];
        
        } else {
          cnValue = username;
        }
      
        const userDn = `cn=${cnValue},${this.baseDn}`;
        console.log(`Authenticating user with DN: ${userDn}`);
      
        return new Promise((resolve, reject) => {
          this.client.bind(userDn, password, (err) => {
            if (err) {
              console.error(`Authentication failed for user ${username}: ${err}`);
              reject(new UnauthorizedException('Unauthorized'))

            } else {
              console.log(`Authentication successful for user ${username}`);
              resolve(true);
            }
          });
        });
      }
    
  //search for user with username
  async CheckUserLdap(cn: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const searchOptions: ldap.SearchOptions = {
        scope: 'sub',
        filter: `(cn=${cn})`,
        attributes: ldapAttributes,
      };
      let user: any = {};
      this.client.search(this.baseDn, searchOptions, (err, res) => {
        if (err) {
          console.error(`LDAP search failed: ${err}`);
          reject(err);
        } else {
          res.on('searchEntry', (entry) => {
            const attributes = entry.pojo.attributes;
            const attributeMap = {
              
              cn: 'username',
              mail:'email'
              
             
            };
            attributes.forEach((attribute: any) => {
              const key = attribute.type.toLowerCase();
              if (attributeMap.hasOwnProperty(key)) {
                const propName = attributeMap[key];
                user[propName] = attribute.values[0];
              }
            });
          });
          res.on('end', () => {
            if (user.hasOwnProperty('username')) {
              resolve(user);
            } else {
              const errors = { User: 'the searched user does not exists in ldap !' };
              reject(new HttpException({ errors }, 401));
            }
          });
        }
      });
    });
  }
  
// methode signin with ldap 
  async SignIn(username: string, password: string): Promise<{ accesToken: string , role:string, username:string}> {
    
    // authenticate with LDAP
    const authenticated = await this.authenticate(username, password);
    if (!authenticated) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // search for user in LDAP by username
    const userFromLdap = await this.CheckUserLdap(username);
    console.log('===>checking username in ldap=>:',userFromLdap )
    // search for a user in database
    let userFromDb = await this.userRepository.findOne({
      where: { username }

    })
    console.log('==>checking username in database:=>',{ username } )

    ;
  
    if (!userFromDb) {
      console.log('2===>: not exist 9a3ed yetsna3 ')
  
      // create new user in the database
      userFromDb = await this.userRepository.create({
        username: userFromLdap.username,
        role: Role.Collaborateur,
        email:userFromLdap.email
      });
      await this.userRepository.save(userFromDb);
      console.log("l user ili tisna3==>:",userFromDb)
    } 
  
    // generate access token
    const payload: JwtPayload = {
      username: userFromDb.username,
      role: userFromDb.role,
    };
    const accesToken = await this.jwtService.sign(payload);
  
    return { accesToken:accesToken, role: userFromDb.role, username:userFromDb.username };
  }



}
