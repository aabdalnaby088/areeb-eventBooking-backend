import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "./event.schema";
import { JwtModule } from "@nestjs/jwt";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), JwtModule, CloudinaryModule],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {}