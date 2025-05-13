import { ConflictException, Injectable, UseInterceptors } from "@nestjs/common";
import {  User, UserDocument, UserSchema } from './user.schema';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Sign } from "crypto";
import { SignupDto } from "./dtos/signup.dto";
import { JwtService } from "@nestjs/jwt";
import { ResponseInterceptor } from "../interceptors/response.interceptor";
import { signinDto } from "./dtos/signin.dto";
import * as bcrypt from 'bcrypt';

@UseInterceptors(new ResponseInterceptor())
@Injectable()
export class UserService {
    
  constructor(@InjectModel
  (User.name) private userModel: Model<UserDocument>,
  private readonly jwtService: JwtService,
) {}

async signup(signUpDto: SignupDto): Promise<String> {
    const {email} = signUpDto;
    const user = await this.userModel.findOne({email});
    if (user) {
      throw new ConflictException('Email already exists');
    }
    
    const newUser = new this.userModel(signUpDto);
    const payload = { id: newUser.id, role: newUser.role };
    const accessToken = this.jwtService.sign(payload);
    await newUser.save();
    return accessToken;
  }

  async signin(signinDto: signinDto): Promise<String> {
    const {email, password} = signinDto;
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw new ConflictException('Invalid email or password');
    }
    const CheckPassword = await bcrypt.compare(password, user.password);
    if (!CheckPassword) {
      throw new ConflictException('Invalid email or password');
    }
    const payload = { id: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}