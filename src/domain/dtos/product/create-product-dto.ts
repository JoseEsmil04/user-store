import { Validators } from "../../../config";

export class CreateProductDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // userID
    public readonly category: string, // categoryID
  ){}

  static create(props: {[key: string]: any}): [string?, CreateProductDto?] {

    const {
      name,
      available,
      price,
      description,
      user,
      category,
    } = props;

    if(!name) return ['Missing Name!', undefined];

    if(!user) return ['Missing User!', undefined];
    if(!Validators.isMongoID(user)) return ['Invalid user ID', undefined];
    
    if(!category) return ['Missing Category!', undefined];
    if(!Validators.isMongoID(category)) return ['Invalid category ID', undefined];


    return [undefined, new CreateProductDto(
      name,
      !!available,
      price,
      description,
      user,
      category,
    )];
  }
}