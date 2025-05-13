import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { UserRole } from "../utils/constants";


export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);