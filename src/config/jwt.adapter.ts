import jwt from 'jsonwebtoken'
import { envs } from './envs'
import { resolve } from 'path'



const JWT_SEED = envs.JWT_SEED

export class JWTadapter {

  
  static async generateToken(payload: any, expires: string = '2h') {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: expires }, (err, token) => {
        if(err) resolve(null)
  
        return resolve(token)
      })
    })
    
  }

  static async validateToken<T>(token: string): Promise<T | null> {

    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if(err) return resolve(null)

        return resolve(decoded as T)
      })
    })
  }
}