import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventModule } from './Event/event.module';
import { CartModule } from './Cart/cart.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Areeb'),
    UserModule,
    EventModule,
    CartModule,
    ConfigModule.forRoot({ isGlobal: true }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}