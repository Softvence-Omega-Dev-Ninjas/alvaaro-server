import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminModule } from './main/admin/admin.module';
import { AuthModule } from './main/auth/auth.module';
import { CarModule } from './main/car/car.module';
import { ContactModule } from './main/contact/contact.module';
import { CouponModule } from './main/coupon/coupon.module';
import { JwelleryModule } from './main/jwellery/jwellery.module';
import { NewsModule } from './main/news/news.module';
import { NewsletterModule } from './main/newsletter/newsletter.module';
import { PaymentModule } from './main/payment/payment.module';
import { ProductModule } from './main/product/product.module';
import { RealEstateModule } from './main/real-estate/real-estate.module';
import { SellerModule } from './main/seller/seller.module';
import { SubscriptionplanModule } from './main/subscriptionplan/subscriptionplan.module';
import { UploadsModule } from './main/uploads/uploads.module';
import { UserModule } from './main/user/user.module';
import { WatchModule } from './main/watch/watch.module';
import { YachtModule } from './main/yacht/yacht.module';
import { PrismaModule } from './prisma-service/prisma-service.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    CarModule,
    ProductModule,
    SubscriptionplanModule,
    NewsletterModule,
    SellerModule,
    JwelleryModule,
    WatchModule,
    ContactModule,
    CacheModule.register({
      isGlobal: true,
    }),
    RealEstateModule,
    YachtModule,
    PaymentModule,
    CouponModule,
    AdminModule,
    NewsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AppService],
})
export class AppModule { }
