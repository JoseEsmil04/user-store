import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { ProductController } from './product-controller';
import { ProductService } from '../services/product-service';



export class ProductRoutes {


  static get routes(): Router {

    const router = Router();
    const productService = new ProductService();
    const controller = new ProductController(productService);
    
    // // Definir las rutas
    router.get('/', controller.getProducts);
    router.post('/',[AuthMiddleware.validateJWT],controller.createProduct);
    // router.put('/:name', controller.updateProduct);
    // router.delete('/:name', controller.deleteProduct);



    return router;
  }


}