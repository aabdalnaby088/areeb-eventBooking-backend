import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Model, Types } from 'mongoose';
import { UpdateQuantityDto } from './dtos/update-quantity.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  async addItemToCart(EventId: string, userId: string): Promise<Cart> {
    console.log(userId);
    const eventObjectId = new Types.ObjectId(EventId);
    const userObjectId = new Types.ObjectId(userId);
    
    let cart = await this.cartModel.findOne({ userId: userObjectId });

    if (!cart) {
      cart = new this.cartModel({
        userId: userObjectId,
        items: [{ eventId: eventObjectId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.eventId.toString() === EventId,
      );
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ eventId: eventObjectId, quantity: 1 });
      }
    }

    await cart.save();
    return cart;
  }

  async getCart(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    return this.cartModel
      .findOne({ userId: userObjectId })
      .populate('items.eventId');
  }

  async adjustItemQuantity(userId: string, updateDto: UpdateQuantityDto): Promise<Cart> {
    const {newQuantity, eventId} = updateDto;
  const userObjectId = new Types.ObjectId(userId);
  const eventObjectId = new Types.ObjectId(eventId);

  const cart = await this.cartModel.findOne({ userId: userObjectId });
  if (!cart) throw new Error('Cart not found');

  const itemIndex = cart.items.findIndex(
    (item) => item.eventId.toString() === eventObjectId.toString(),
  );
  
  if (itemIndex === -1) {
    throw new NotFoundException('Item not found in cart');
  }

  if (newQuantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = newQuantity;
  }

  await cart.save();
  return cart;
}

async removeItemFromCart(userId: string, eventId: string): Promise<Cart> {
  const userObjectId = new Types.ObjectId(userId);
  const eventObjectId = new Types.ObjectId(eventId);

  const cart = await this.cartModel.findOne({ userId: userObjectId });
  if (!cart) throw new NotFoundException('Cart not found');

  const originalLength = cart.items.length;

  // Filter out the item to remove
  cart.items = cart.items.filter(
    (item) => item.eventId.toString() !== eventObjectId.toString(),
  );

  if (cart.items.length === originalLength) {
    throw new NotFoundException('Item not found in cart');
  }

  await cart.save();
  return cart;
}


async deleteCart(userId: string){
  const userObjectId = new Types.ObjectId(userId);

  const cart = await this.cartModel.findOneAndDelete({ userId: userObjectId });
  if (!cart) throw new NotFoundException('Cart not found');

}


}
