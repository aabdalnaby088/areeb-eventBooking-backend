import { IsOptional, IsString, IsDateString, IsNumberString, MinLength, IsEnum } from "class-validator";
import { EventCategory } from "src/utils/constants";

export class editEventDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  venue?: string;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: string;
}