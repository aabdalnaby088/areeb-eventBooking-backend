import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinay.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from '../config/cloudinary.config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
