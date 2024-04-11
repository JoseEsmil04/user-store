import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";
import { UpdateCategoryDto } from "../../domain/dtos/category/update-category-dto";
import { CategoryEntity } from "../../domain/entities/category-entity";




export class CategoryService {


  constructor(){}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExist = await CategoryModel.findOne({name: createCategoryDto.name});
    if(categoryExist) throw CustomError.badRequest(`Category ${createCategoryDto.name} already exist!`);


    try {
      const category = new CategoryModel({ ...createCategoryDto, user: user.id });
      await category.save()

      return {
        id: category.id,
        name: category.name,
        available: category.available
      }
    
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getCategories(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    try {

      const [total, allCategories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
      ])

      return {
        total: total,
        page: page,
        limit: limit,
        next: `/api/categories/?page=${(page + 1)}&limit=${limit}`,
        prev: ((page - 1) > 0) ? `/api/categories/?page=${(page - 1)}&limit=${limit}` : null,
        categories: allCategories.map(category => CategoryEntity.fromObject(category))
      }

    } catch (error) {
      console.log(`${error}`)
      throw CustomError.internalServer('Internal Server Error')
    }
  }

  async updateCategory(name: string, updateCategoryDto: UpdateCategoryDto) {
    const categoryExists = await CategoryModel.findOne({name});
    if(!categoryExists) throw CustomError.notFound('No se encuentra la categoria');
    
    try {
      
      const categoryToUpdate = await CategoryModel.findOneAndUpdate({name}, {
        name: updateCategoryDto.name,
        available: updateCategoryDto.available
      }, {new: true});
  
      if(!categoryToUpdate) return CustomError.badRequest('Error while Update Category');

      await categoryToUpdate.save();

      return CategoryEntity.fromObject(categoryToUpdate);
    } catch (error) {
      console.log(`${error}`);
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async deleteCategory(name: string) {
    const categoryExists = await CategoryModel.findOne({name});
    if(!categoryExists) throw CustomError.notFound('No se encuentra la categoria');

    try {
      const categoryToDelete = await CategoryModel.findOneAndDelete({name});
      if(!categoryToDelete) return CustomError.badRequest('Error while Deleting Category');

      const message = 'Eliminado exitosamente!';

      return [
        message,
        CategoryEntity.fromObject(categoryToDelete)
      ]
    } catch (error) {
      console.log(`${error}`);
      throw CustomError.internalServer('Internal Server Error')
    }
  }
}