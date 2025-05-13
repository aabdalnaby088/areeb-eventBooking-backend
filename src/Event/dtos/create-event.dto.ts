import { IsNotEmpty, IsString, MinDate, MinLength, Validate } from "class-validator";



export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string;
    @IsString()
    @IsNotEmpty()
    category: string;
    @IsString()
    @IsNotEmpty()
    @Validate(MinDate, [new Date(Date.now() + 24 * 60 * 60 * 1000)]) 
    date: Date;
    @IsString()
    @IsNotEmpty()
    venue: string;
    @IsString()
    @IsNotEmpty()
    price: number;
}