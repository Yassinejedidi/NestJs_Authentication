import * as fs from 'fs';
import * as https from 'https';

process.removeAllListeners('warning')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const config = {
  ldapUrl: 'ldaps://localhost:10636',
  baseDn: 'ou=users,ou=system',
  httpsAgent: httpsAgent
};

export const ldapAttributes = ['cn', 'sn', 'mail', 'userPassword', 'telephoneNumber'];
