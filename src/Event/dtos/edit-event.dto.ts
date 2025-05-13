import { IsString, MinLength } from "class-validator";


export class editEventDto{

    @IsString()
    @MinLength(3)
    name: String
}