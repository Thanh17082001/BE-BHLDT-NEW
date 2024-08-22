import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as express from 'express';
import { join } from 'path';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionGuard } from './permission/permission.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.enableCors();
  app.setGlobalPrefix('api');
  //thuc te thi bo '..' 
  app.use(express.static(join(__dirname,'..', 'public')));
  app.use(express.json({ limit: '1024mb' }))
  app.use(express.urlencoded({ limit: '1024mb', extended: true }));
 app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    disableErrorMessages: false
  }));
  const config = new DocumentBuilder().setTitle("API FOR BHLDT").setDescription("Author:Thanh & Loc ").setVersion("1.0").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      tagsSorter: "alpha", // Sắp xếp các tag theo thứ tự từ A-Z
    },
  });

  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  // app.useGlobalGuards(new PermissionGuard(reflector));
  // app.use('/static', express.static(join( '..', 'static')));
  const PORT = process.env.PORT || 3000
  await app.listen(PORT);
  //await app.listen(3243);
  console.log(`Server is running at: http://localhost:${PORT}/api`);

}
bootstrap();
