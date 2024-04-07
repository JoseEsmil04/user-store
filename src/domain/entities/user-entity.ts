import { CustomError } from "../errors/custom-errors"


export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string,
  ) {}

  static fromObject(object: {[key: string]: any}): UserEntity {
    const { id, _id, name, email, emailValidated, password, role, img } = object

    if(!id && !_id) {
      throw CustomError.badRequest('Missing id!')
    }

    if(!name) throw CustomError.badRequest('Missing Name!')
    if(!email) throw CustomError.badRequest('Missing Email!')
    if(emailValidated === undefined) throw CustomError.badRequest('Missing EmailValidated!')
    if(!password) throw CustomError.badRequest('Missing Password!')
    if(!role) throw CustomError.badRequest('Missing Role!')

    return new UserEntity(id || _id, name, email, emailValidated, password, role, img)
  }
}