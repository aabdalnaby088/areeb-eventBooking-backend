import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventCategory } from '../utils/constants';

export type UserDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: EventCategory })
  category: string;

  @Prop({ required: true  })
  date: Date;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: '' })
  imageUrl: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
