


export class CreateCategoryDto {

  constructor(
    public readonly name: string,
    public readonly available: string
  ) {}



  static create(body: {[key: string]: any}): [string?, CreateCategoryDto?] {

    const {name, available = false} = body;
    let availableAsBool = available;

    if(!name) return ['Name of category is Required!', undefined];
    if(typeof available !== 'boolean') {
      availableAsBool = (available === 'true');
    }

    return [undefined, new CreateCategoryDto(name, availableAsBool)]
  }
} 