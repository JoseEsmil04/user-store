import { CreateProductDto, CustomError, PaginationDto } from "../../domain"
import { Request, Response } from "express"
import { ProductService } from "../services/product-service";


export class ProductController {

  // DI
  constructor(public readonly productService: ProductService){}

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`${error}`)
    return res.status(500).json({error});
  }

  public getProducts = async(req: Request, res: Response) => {
    const {page = 1, limit = 5} = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if(error) return res.status(400).json({error})

    this.productService.getProducts(paginationDto!)
      .then(products => res.status(200).json(products))
      .catch(err => this.handleError(err, res))
  }

  public createProduct = async(req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({ ...req.body, user: req.body.user.id });

    if(error) return res.status(400).json({error});

    this.productService.createProduct(createProductDto!)
      .then(product => res.status(201).json(product))
      .catch(err => this.handleError(err, res));
  }

  // public updateProduct = async(req: Request, res: Response) => {
  //   const name = req.params.name;
  //   const [error, updateCategoryDto] = UpdateCategoryDto.create({name, ...req.body});

  //   if(error) return res.status(400).json({ error })

  //   this.categoryService.updateCategory(name, updateCategoryDto!)
  //     .then(category => res.status(200).json(category))
  //     .catch(err => this.handleError(err, res))

  //   return res.json({msg: "Update Product"});
  // }

  // public deleteProduct = async(req: Request, res: Response) => {
  //   const name = req.params.name;
    
  //   this.categoryService.deleteCategory(name)
  //     .then(category => res.status(200).json(category))
  //     .catch(err => this.handleError(err, res))

  //   return res.json({msg: "Delete Product"});
  // }
}