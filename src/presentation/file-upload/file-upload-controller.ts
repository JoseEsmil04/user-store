import { CustomError } from "../../domain";
import { Request, Response } from "express"
import { FileUploadService } from "../services/file-upload-service";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {

  // DI
  constructor(public readonly fileUploadService: FileUploadService){}

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`${error}`)
    return res.status(500).json({error});
  }

  public uploadFile = async(req: Request, res: Response) => {
    const type = req.params.type
    const file = req.body.files.at(0) as UploadedFile

    this.fileUploadService.uploadSingleFile(file, `uploads/${ type }`)
      .then(uploaded => res.json(uploaded))
      .catch(err => this.handleError(err, res))
  }

  public uploadMultipleFiles = async(req: Request, res: Response) => {
    const type = req.params.type
    const files = req.body.files as UploadedFile[]

    this.fileUploadService.uploadMultipleFiles(files, `uploads/${ type }`)
      .then(uploadedFiles => res.json(uploadedFiles))
      .catch(err => this.handleError(err, res))
  }
}