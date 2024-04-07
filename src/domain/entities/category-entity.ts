import { CustomError } from "../errors/custom-errors"

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public user: string
  ) {}

  static fromObject(object: {[key: string]: any}): CategoryEntity {
    const { id, _id, name, available, user} = object

    if(!id && !_id) {
      throw CustomError.badRequest('Missing id!')
    }

    if(!name) throw CustomError.badRequest('Missing Name!')
    if(available === undefined) throw CustomError.badRequest('Missing available!')
    if(!user) throw CustomError.badRequest('Missing User!')

    return new CategoryEntity(id || _id, name, available, user);
  }
}