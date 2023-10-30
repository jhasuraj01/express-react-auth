import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import AuthService from '@src/services/AuthService';

import { IReq, IRes } from './types/express/misc';
import { ISessionUser } from '@src/models/User';
import { JwtPayload } from 'jsonwebtoken';

// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
  isSessionLogin: boolean;
  totpToken?: string;
}

interface ISignupReq {
  name: string;
  email: string;
  password: string;
  totpSecret: string;
}

type TSessionData = ISessionUser & JwtPayload;


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password, isSessionLogin, totpToken } = req.body;

  // Login
  const user = await AuthService.login(email, password, totpToken);
  // Setup Admin Cookie
  await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }, isSessionLogin === true);
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

async function signup(req: IReq<ISignupReq>, res: IRes) {
  const { name, email, password, totpSecret } = req.body;
  // Signup
  const user = await AuthService.signup(name, email, password, totpSecret);
  // // Setup Admin Cookie
  await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    totpSecret: user.totpSecret
  });
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  SessionUtil.clearCookie(res);
  return res.status(HttpStatusCodes.OK).end();
}

async function getAuthenticatedUser(req: IReq, res: IRes) {
  
  const sessionData = await SessionUtil.getSessionData<TSessionData>(req);

  if (typeof sessionData === 'object') {
    return res
      .status(HttpStatusCodes.OK)
      .json(sessionData)
  // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: 'User is not authenticated' });
  }
}

async function getTotp(req: IReq, res: IRes) {
  const data = await AuthService.getTotp()
  return res
    .status(HttpStatusCodes.OK)
    .json(data)
}
// **** Export default **** //

export default {
  login,
  logout,
  signup,
  getAuthenticatedUser,
  getTotp,
} as const;
