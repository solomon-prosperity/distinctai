import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { formatValidationError } from './common/helpers';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.flatMap((error) =>
          formatValidationError(error),
        );
        return new BadRequestException(formattedErrors);
      },
      stopAtFirstError: true,
      whitelist: true, // Strips out properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if unknown fields are passed
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Distinct AI Owner Service Documentation')
    .setDescription('Documentation for the distinct AI owner service')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'ownerproto',
      protoPath: join(__dirname, '../../proto/owner/owner.proto'),
      url: `0.0.0.0:${process.env.GRPC_PORT}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.HTTP_PORT || 3000);
}
bootstrap();
