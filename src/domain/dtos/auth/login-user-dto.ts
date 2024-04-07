import { regularExps } from '../../../config/regular-exp';


export class LoginUserDto {

  private constructor(
    public email: string,
    public password: string
  ){}


  static create(object: {[key: string]: any}): [string?, LoginUserDto?] {
    const { email, password } = object

    if(!email) return ['Missing email!', undefined]
    if(!regularExps.email.test(email)) return ['Email is not valid!', undefined] 
    if(!password) return ['Missing Password!', undefined]
    if(password.length < 8) return ['The password must be a minimum of 8 characters', undefined]

    return [undefined, new LoginUserDto(email, password)]
  }
}