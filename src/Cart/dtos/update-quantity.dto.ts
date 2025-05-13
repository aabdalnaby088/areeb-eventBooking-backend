import { IsNotEmpty, IsMongoId, IsInt } from 'class-validator';

export class UpdateQuantityDto {
  @IsNotEmpty()
  @IsMongoId()
  eventId: string;

  @IsNotEmpty()
  @IsInt()
  newQuantity: number;
}
