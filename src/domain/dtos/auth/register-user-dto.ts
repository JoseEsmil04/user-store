import { regularExps } from "../../../config/regular-exp"


export class RegisterUserDto {
  public name: string
  public email: string
  public password: string


  private constructor(name: string, email: string, password: string){
    this.name = name
    this.email = email
    this.password = password
  }

  static create(objeto: {[key: string]: any}): [string?, RegisterUserDto?] {
    const { name, email, password } = objeto

    if(!name) return ['Missing name!', undefined]
    if(!email) return ['Missing email!', undefined]
    if(!regularExps.email.test(email)) return ['Email is not valid!', undefined] 
    if(!password) return ['Missing Password!', undefined]
    if(password.length < 8) return ['The password must be a minimum of 8 characters', undefined]

    return [undefined, new RegisterUserDto(name, email, password)]
  }


}