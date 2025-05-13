import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const [type , token]: string[] = request.headers.authorization?.split(' ')?? [];
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('No token provided or invalid token');
        }
        
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET'),
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }   
    }

}