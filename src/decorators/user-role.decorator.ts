import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { UserRole } from "src/utils/constants";


export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);