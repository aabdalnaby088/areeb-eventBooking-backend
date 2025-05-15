import { InjectModel } from "@nestjs/mongoose";
import { Event } from "./event.schema";
import { Model } from "mongoose";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateEventDto } from "./dtos/create-event.dto";
import { editEventDto } from "./dtos/edit-event.dto";
import { CloudinaryService } from "..//cloudinary/cloudinay.service";


@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async createEvent(
      eventDto: CreateEventDto,
      file?: Express.Multer.File,
    ): Promise<Event> {
      // 1. Check for duplicate event by name
      const existingEvent = await this.eventModel.findOne({ name: eventDto.name });
      if (existingEvent) {
        throw new ConflictException('Event already exists');
      }

      let imageUrl = '';

        if (file) {
          try {
            const uploadResult = await this.cloudinaryService.uploadImage(file, 'event');
            imageUrl = uploadResult.secure_url;
          } catch (error) {
            throw new BadRequestException(`Image upload failed: ${error.message}`);
          }
        }

      const createdEvent = new this.eventModel({
        ...eventDto,
        imageUrl,
      });

      return await createdEvent.save();
    }
    
    async EditEvent(editDto: editEventDto, id: String, File?: Express.Multer.File): Promise<Event> {
      
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        if (File) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(File, 'event');
                console.log(uploadResult);
                const publicIdwithExtention = event.imageUrl.split('/').pop()??'';
                const publicId: string = publicIdwithExtention.split('.')[0] ?? '';
                await this.cloudinaryService.deleteImage(publicId);
                event.imageUrl = uploadResult.secure_url;
            } catch (error) {
                throw new BadRequestException(`Image upload failed: ${error.message}`);
            }
        }
        Object.keys(editDto).forEach((key) => {
        if (editDto[key] !== undefined) {
            event[key] = editDto[key];
        }
        });
        event.save();
        return event;
    }

    async listEvent(): Promise<Event[]> {
        const events = await this.eventModel.find();
        return events;
    }

    async getEvent(id: String): Promise<Event> {
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        return event;
    }

    async getEventsByCategory(category: String, page: number = 1): Promise<Event[]> {
        const skip = (page - 1) * 4;
        const events = await this.eventModel.find({ category }).skip(skip).limit(4);
        return events;
    }

    async deleteEvent(id: String):Promise<String> {        
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        const publicIdwithExtention = event.imageUrl.split('/').pop()??'';
        const publicId: string = publicIdwithExtention.split('.')[0] ?? '';
        await this.cloudinaryService.deleteImage(publicId);
        await this.eventModel.findByIdAndDelete(id);
        return 'Event deleted successfully';
    }
  }