import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";



(async() => {
  await MongoDatabase.connection({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  })

  await main();

  await MongoDatabase.disconnection();
})();


const randomBetween0AndX = (x: number): number => {
  return Math.floor(Math.random() * x);
}

async function main() {
  
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany()
  ])

  const user = await UserModel.insertMany(seedData.users);

  const categories = await CategoryModel.insertMany(
    seedData.categories.map(category => {
      return {
        ...category,
        user: user[randomBetween0AndX(seedData.users.length - 1)]._id
      }
    })
  )

  const products = await ProductModel.insertMany(
    seedData.products.map(product => {
      return {
        ...product,
        category: categories[randomBetween0AndX(seedData.users.length - 1)]._id,
        user: user[randomBetween0AndX(seedData.users.length - 1)]._id
      }
    })
  )

  console.log('SEDEED!!')
}