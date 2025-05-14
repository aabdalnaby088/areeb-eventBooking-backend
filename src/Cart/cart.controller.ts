import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AuthGuard } from "../guards/auth.guards";
import { UpdateQuantityDto } from "./dtos/update-quantity.dto";



@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}
    @Post('add/:eventId')
    @UseGuards(AuthGuard)
    async addItemToCart(@Param('eventId') eventId: string, @Req() req: Request) {
        console.log(req['user']);
        const {id:userId } = req['user']; 
        return this.cartService.addItemToCart(eventId, userId);
    }
    @Get()
    @UseGuards(AuthGuard)
    async getCart(@Req() req: Request) {
        const {id:userId } = req['user']; 
        return this.cartService.getCart(userId);
    }

    @Patch('update')
    @UseGuards(AuthGuard)
    async updateQuantity(
    @Body() updateDto: UpdateQuantityDto,
    @Req() req: Request,
    ) {
    const userId = req['user'].id;
    return await this.cartService.adjustItemQuantity(userId, updateDto);
    }

    @Delete('remove/:eventId')
    @UseGuards(AuthGuard)
    async removeItemFromCart(
    @Param('eventId') eventId: string,
    @Req() req: Request,
    ) {
    const userId = req['user'].id;
    return await this.cartService.removeItemFromCart(userId, eventId);
    }

    @Delete()
    @UseGuards(AuthGuard)
    async deleteCart(@Req() req: Request) {
        const userId = req['user'].id;
        return await this.cartService.deleteCart(userId);
    }
}