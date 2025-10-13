import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
@Injectable()
export class FileUploadService {
  getFile(fileName: string, res: Response) {
    const filePath = join(process.cwd(), 'uploads', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stream = createReadStream(filePath);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="${fileName}"`,
    });

    return new StreamableFile(stream);
  }
  deleteFiles(files: string[]) {
    for (const file of files) {
      const filePath = join(process.cwd(), 'uploads', file);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }
  }
}
