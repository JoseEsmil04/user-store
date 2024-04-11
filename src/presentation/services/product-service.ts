
import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain"


export class ProductService {


  constructor(){}

  async createProduct(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({name: createProductDto.name});
    if(productExists) throw CustomError.badRequest(`Product ${createProductDto.name} already exist!`);


    try {
      const product = new ProductModel(createProductDto)
      await product.save()

      return product;
    
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getProducts(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    try {

      const [total, allProducts] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user')
        .populate('category')
      ])

      return {
        total: total,
        page: page,
        limit: limit,
        next: `/api/products/?page=${(page + 1)}&limit=${limit}`,
        prev: ((page - 1) > 0) ? `/api/products/?page=${(page - 1)}&limit=${limit}` : null,
        categories: allProducts
      }

    } catch (error) {
      console.log(`${error}`)
      throw CustomError.internalServer('Internal Server Error')
    }
  }

  // async updateCategory(name: string, updateCategoryDto: UpdateCategoryDto) {
  //   const categoryExists = await CategoryModel.findOne({name});
  //   if(!categoryExists) throw CustomError.notFound('No se encuentra la categoria');
    
  //   try {
      
  //     const categoryToUpdate = await CategoryModel.findOneAndUpdate({name}, {
  //       name: updateCategoryDto.name,
  //       available: updateCategoryDto.available
  //     }, {new: true});
  
  //     if(!categoryToUpdate) return CustomError.badRequest('Error while Update Category');

  //     await categoryToUpdate.save();

  //     return CategoryEntity.fromObject(categoryToUpdate);
  //   } catch (error) {
  //     console.log(`${error}`);
  //     throw CustomError.internalServer('Internal Server Error');
  //   }
  // }

  // async deleteCategory(name: string) {
  //   const categoryExists = await CategoryModel.findOne({name});
  //   if(!categoryExists) throw CustomError.notFound('No se encuentra la categoria');

  //   try {
  //     const categoryToDelete = await CategoryModel.findOneAndDelete({name});
  //     if(!categoryToDelete) return CustomError.badRequest('Error while Deleting Category');

  //     const message = 'Eliminado exitosamente!';

  //     return [
  //       message,
  //       CategoryEntity.fromObject(categoryToDelete)
  //     ]
  //   } catch (error) {
  //     console.log(`${error}`);
  //     throw CustomError.internalServer('Internal Server Error')
  //   }
  // }
}