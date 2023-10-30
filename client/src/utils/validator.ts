import isEmail from 'validator/es/lib/isEmail';
import PasswordValidator from 'password-validator';

const passwordSchema = new PasswordValidator();

passwordSchema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase(1)                              // Must have uppercase letters
  .has().lowercase(1)                              // Must have lowercase letters
  .has().digits(1)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces
  .has().symbols(1)                                // should have special symbols
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

export const validateEmail = (value: string) => {
  return isEmail(value);
}

export const validatePassword = (value: string) => {
  const res = passwordSchema.validate(value, { details: true });
  if(typeof res === 'boolean' || res.length === 0) return true;
  return res[0].message ?? "Invalid Password";
}