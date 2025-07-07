import GoogleDriveService from '@services/google/google-drive-service';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
//import fs from "node:fs";

@injectable()
export default class FileService {
  constructor(
    @inject(TYPES.GoogleDriveService)
    private googleDriveService: GoogleDriveService
  ) {}
}
