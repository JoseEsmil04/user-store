import { BcryptAdapter, envs } from "../../config";
import { JWTadapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { EmailService } from "./email-service";


export class AuthService {
  
  // DI
  constructor(
    private readonly emailService: EmailService
  ){}


  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email })
    
    if(existUser) throw CustomError.badRequest('Email already exist!!')
    
    try {
      const user = new UserModel(registerUserDto)

      // Encriptar la contraseña
      user.password = BcryptAdapter.hash(user.password) 

      
      const token = await JWTadapter.generateToken({ id: user.id })
      if(!token) throw CustomError.internalServer('Error while creating JWT')
      
      // await JWTadapter.validateToken(`${token}`)
      
      await user.save() // Guardar el Usuario
      
      await this.sendEmailValidationLink(user.email)

      const {password, ...userEntity} = UserEntity.fromObject(user)
      
      
      return {
        user: userEntity,
        token: token
      }
      
    } catch (error) {
      console.log(`${error}`)
      throw CustomError.internalServer(`Internal Server Error!`)
    }
  }

  public async loginUser( loginUserDto: LoginUserDto ) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email does not exist');

    const isMatching = BcryptAdapter.compare( loginUserDto.password, user.password );
    if (!isMatching) throw CustomError.badRequest('incorrect Password!');

    const { password, ...userEntity} = UserEntity.fromObject( user );

    const token = await JWTadapter.generateToken({ id: user.id })
    if(!token) throw CustomError.internalServer('Error while creating JWT')


    // await JWTadapter.validateToken(`${token}`)

    return {
      user: userEntity,
      token: token,
    }
  }

  private sendEmailValidationLink = async(email: string) => {

    const token = await JWTadapter.generateToken({ email })
    if(!token) throw CustomError.internalServer('Error while creating JWT')

    const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`

    const htmlBody = `
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Validation</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(to bottom, #2980b9, #3498db);
            }

            .container {
                text-align: center;
                font-family: 'Arial', sans-serif;
                color: #fff;
            }

            h1 {
                font-size: 2em;
                margin-bottom: 20px;
            }

            p {
                font-size: 1.2em;
                margin-bottom: 30px;
            }

            a {
                display: inline-block;
                background-color: #fff;
                color: #2980b9;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                font-size: 1.1em;
                transition: background-color 0.3s;
            }

            a:hover {
                background-color: #3498db;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Validate Email</h1>
            <p>Click on the following link to validate your email:</p>
            <a href="${link}">Validate your email: ${email}</a>
        </div>
    </body>
    `


    const options = {
      to: email,
      subject: 'Validate your Email!',
      htmlBody: htmlBody
    }

    const isSent = await this.emailService.sendEmail(options)
    if(!isSent) throw CustomError.internalServer('Error sending Email')

    return true
  }

  public validateEmail = async(token: string) => {

    const payload = await JWTadapter.validateToken<string>(token)
    if(!payload) throw CustomError.unAuthorized('Unauthorized - Invalid Token')

    const { email } = payload as any
    if(!email) throw CustomError.internalServer('Internal Server Error - Email not in token!')

    const user = await UserModel.findOne({ email })
    if(!user) throw CustomError.internalServer('Internal Server Error - Email not exist in DB')

    user.emailValidated = true
    await user.save()

    return true

  }
}