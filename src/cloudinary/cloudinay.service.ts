import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 1MB limit');
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if(!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

    async deleteImage(publicId: string): Promise<void> {
    try {
      const pathToDelete = `event/${publicId}`;
      await cloudinary.uploader.destroy(pathToDelete, { resource_type: 'image' })
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}