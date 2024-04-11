import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain"
import { Request, Response } from "express"
import { CategoryService } from "../services/category-service";
import { UpdateCategoryDto } from "../../domain/dtos/category/update-category-dto";

export class CategoryController {

  // DI
  constructor(public readonly categoryService: CategoryService){}

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`${error}`)
    return res.status(500).json({error});
  }

  public getCategories = async(req: Request, res: Response) => {
    const {page = 1, limit = 5} = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if(error) return res.status(400).json({error})

    this.categoryService.getCategories(paginationDto!)
      .then(categories => res.status(200).json(categories))
      .catch(err => this.handleError(err, res))
  }

  public createCategory = async(req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

    if(error) return res.status(400).json({error});

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json(category))
      .catch(err => this.handleError(err, res));
  }

  public updateCategory = async(req: Request, res: Response) => {
    const name = req.params.name;
    const [error, updateCategoryDto] = UpdateCategoryDto.create({name, ...req.body});

    if(error) return res.status(400).json({ error })

    this.categoryService.updateCategory(name, updateCategoryDto!)
      .then(category => res.status(200).json(category))
      .catch(err => this.handleError(err, res))
  }

  public deleteCategory = async(req: Request, res: Response) => {
    const name = req.params.name;
    
    this.categoryService.deleteCategory(name)
      .then(category => res.status(200).json(category))
      .catch(err => this.handleError(err, res))
  }
}