import { Router } from 'express';
import { CategoryController } from './category-controller';
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { CategoryService } from '../services/category-service';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);
    
    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/',[AuthMiddleware.validateJWT],controller.createCategory);
    router.put('/:name', controller.updateCategory);
    router.delete('/:name', controller.deleteCategory);



    return router;
  }


}