// src/files/file.controller.ts
import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FileService } from './file.service';

@Controller('images')
@UseGuards(AuthorizationGuard)
export class FileController {
  constructor(
    private readonly imageService: FileService
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'images'),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addPicture(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('animalId') animalId: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    await this.imageService.insertImageFilenamesIntoDB(files, animalId);
    return { status: 'success' };
  }
}
