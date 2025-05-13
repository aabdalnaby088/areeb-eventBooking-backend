import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Match } from "../../decorators/match.decorator";



export class SignupDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    fname: string;
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    lname: string;
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Match('password' , { message: 'Passwords do not match' })
    rePassword: string;
}