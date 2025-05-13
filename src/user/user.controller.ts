import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { SignupDto } from "./dtos/signup.dto";
import { signinDto } from "./dtos/signin.dto";


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    @Post('signup')
     signup(@Body() signUpDto: SignupDto) {
        return this.userService.signup(signUpDto);
    }

    @Post('signin')
     signin(@Body() signinDto: signinDto) {
        return this.userService.signin(signinDto);
    }
}