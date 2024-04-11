

export class UpdateCategoryDto {

  private constructor(
    public readonly name?: string,
    public readonly available?: boolean,
  ){}

  static create(body: {[key:string]: any}): [string?, UpdateCategoryDto?] {

    const { name, updatedName, available = false } = body;

    let isNewNameValid = name;
    let availableAsBool = available;

    if(!name) return ['Actual name is required to Update!', undefined];
    if(updatedName === '') return ['newName must be a valid name!', undefined];
    
    if(typeof available !== 'boolean') {
      availableAsBool = (available === 'true');
    }
    if(updatedName !== name) {
      isNewNameValid = updatedName;
    }


    return [undefined, new UpdateCategoryDto(isNewNameValid || name, availableAsBool)];
  }
}