import { JwtService } from "@nestjs/jwt";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        if (!requiredRoles) {
            return false;
        }
        const request: Request = context.switchToHttp().getRequest();
        
        if (requiredRoles.includes(request['user'].role)) {
            return true;
        }
        throw new UnauthorizedException('User not authorized');
    }

}