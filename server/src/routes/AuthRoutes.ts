import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import AuthService from '@src/services/AuthService';

import { IReq, IRes } from './types/express/misc';


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}

interface ISignupReq {
  name: string;
  email: string;
  password: string;
}


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  // Login
  const user = await AuthService.login(email, password);
  // Setup Admin Cookie
  await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

async function signup(req: IReq<ISignupReq>, res: IRes) {
  const { name, email, password } = req.body;
  // Signup
  const user = await AuthService.signup(name, email, password);
  // // Setup Admin Cookie
  await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
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

// **** Export default **** //

export default {
  login,
  logout,
  signup,
} as const;
