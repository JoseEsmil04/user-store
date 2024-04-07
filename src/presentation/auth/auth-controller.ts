import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth-service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";



export class AuthController {

  // DI
  constructor(
    public readonly authService: AuthService
  ){}

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message})
    }

    console.log(`${error}`)
    return res.status(500).json({error})
  }

  public registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body)
    if(error) return res.status(400).json({error})

    this.authService.registerUser(registerUserDto!)
      .then(user => res.status(201).json(user))
      .catch(error => this.handleError(error, res))
  }

  public loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})

    this.authService.loginUser(loginUserDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) )
  }

  public validateEmail = (req: Request, res: Response) => {

    const { token } = req.params

    this.authService.validateEmail(token)
      .then(() => res.status(200).json({msg: 'Email Validado Exitosamente!'}))
      .catch(error => this.handleError(error, res))
  }
}