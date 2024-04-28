import { Router } from "express"
import { FileUploadController } from "./file-upload-controller";
import { FileUploadService } from "../services/file-upload-service";
import { FileUploadMiddleware } from "../middlewares/file-upload-middleware";
import { TypeMiddleware } from "../middlewares/type-middleware";





export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();
    const fileUploadController = new FileUploadController(
      new FileUploadService()
    )

    router.use(FileUploadMiddleware.containFiles)
    router.use(TypeMiddleware.validTypes(['users', 'products', 'categories']))

    // api/upload/single|multiple/<user|category|product>/
    router.post('/single/:type', fileUploadController.uploadFile)
    router.post('/multiple/:type', fileUploadController.uploadMultipleFiles)

    return router
  }
}