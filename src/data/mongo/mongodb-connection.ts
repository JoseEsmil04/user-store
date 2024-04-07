import mongoose from "mongoose"

interface Options {
  mongoUrl: string
  dbName: string
}

export class MongoDatabase {


  static async connection(options: Options) {
    const { mongoUrl, dbName } = options

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName
      })

      console.log('Conectado!!')
      return true

    } catch (error) {
      console.log('Mongo Connection Error!')
      throw error
    }
  }
}