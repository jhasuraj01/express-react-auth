import UserRepo from '@src/repos/UserRepo';

import PwdUtil from '@src/util/PwdUtil';
import { tick } from '@src/util/misc';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import { IUser, UserRoles } from '@src/models/User';
import * as OTPAuth from "otpauth";

// **** Variables **** //

// Errors
export const Errors = {
  Unauth: 'Unauthorized',
  InvalidTOTP: 'Invalid TOTP Token',
  EmailNotFound(email: string) {
    return `User with email "${email}" not found`;
  },
} as const;

// **** Functions **** //

function totpFactory(secret: string) {
  return new OTPAuth.TOTP({
    issuer: "PCCOE",
    label: "SurajAshishRohanApp",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret, // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
  });
}

/**
 * Login a user.
 */
async function login(email: string, password: string, totpToken?: string): Promise<IUser> {
  // Fetch user
  const user = await UserRepo.getOne(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.EmailNotFound(email),
    );
  }

  // Check password
  const hash = (user.pwdHash ?? ''),
    pwdPassed = await PwdUtil.compare(password, hash);

  if(user.totpSecret) {
    const totp = totpFactory(user.totpSecret ?? '');
    let isTotpValid = totpToken && totp.validate({ token: totpToken, window: 2 }) !== null;

    if(!isTotpValid) {
      await tick(500);
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED, 
        Errors.InvalidTOTP,
      );
    }
  }

  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED, 
      Errors.Unauth,
    );
  }
  // Return
  return user;
}

async function signup(name: string, email: string, password: string, totpSecret: string): Promise<IUser> {
  
  // Fetch user
  const user: IUser = {
    id: Date.now(),
    email,
    pwdHash: await PwdUtil.getHash(password),
    name: name,
    role: UserRoles.Standard,
    totpSecret: totpSecret,
  };

  await UserRepo.add(user);

  return user;
}

async function getTotp() {
  const secret = "dfbkljfgb";
  const totp = totpFactory(secret);
  return {
    secret,
    uri: totp.toString(),
  }
}

// **** Export default **** //

export default {
  login,
  signup,
  getTotp,
} as const;
