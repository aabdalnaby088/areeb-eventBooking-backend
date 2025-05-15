import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dtos/create-event.dto";
import { AuthGuard } from "../guards/auth.guards";
import { AuthRoleGuard } from "..//guards/auth-role.guard";
import { Roles } from "../decorators/user-role.decorator";
import { UserRole } from "..//utils/constants";
import { editEventDto } from "./dtos/edit-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { ConfigService } from "@nestjs/config";


@Controller('event')
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly configService: ConfigService,
    ) {}
@Post('create')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard, AuthRoleGuard)
@UseInterceptors(
FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024,
        files: 1,
      },
    }),
  )
async createEvent(
  @Body() eventDto: CreateEventDto,
  @UploadedFile() file?: Express.Multer.File,
) {    
  return this.eventService.createEvent(eventDto, file);
}


    @Put('edit/:id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard, AuthRoleGuard)
    @UseInterceptors(
    FileInterceptor('image', {
          storage: multer.memoryStorage(),
          limits: {
            fileSize: 50 * 1024 * 1024,
            files: 1,
          },
        }),
  )
    async editEvent(
      @Param('id') id: String,
      @Body() eventDto: editEventDto,
      @UploadedFile() file?: Express.Multer.File) {
        
        return await this.eventService.EditEvent(eventDto, id, file);
    }

    @Get('list')
    async listEvent() {
        return await this.eventService.listEvent();
    }

    @Get('list/:category')
    async listEventByCategory(@Param('category') category: String) {
      
        return await this.eventService.getEventsByCategory(category);
    }

    @Get('details/:id')
    async getEvent(@Param('id') id: String) {
        return await this.eventService.getEvent(id);
    }

    @Delete('delete/:id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard, AuthRoleGuard)
    async deleteEvent(@Param('id') id: String) {
        return await this.eventService.deleteEvent(id);
    }
}