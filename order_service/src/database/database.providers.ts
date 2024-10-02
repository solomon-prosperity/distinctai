import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IMongooseOptions } from './interfaces/database.interfaces';
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (
      configService: ConfigService,
      autoIndex: boolean = true,
    ): Promise<typeof mongoose> => {
      const dbName = configService.get<string>('DATABASE_NAME');
      const connectionString = `mongodb+srv://${encodeURIComponent(
        configService.get<string>('DATABASE_USER')!,
      )}:${encodeURIComponent(configService.get<string>('DATABASE_PASSWORD')!)}@${configService.get<string>('DATABASE_HOST')}/test?retryWrites=true&w=majority`;

      const options: IMongooseOptions = {
        autoIndex,
        ssl: true,
        dbName,
      };
      if (configService.get<string>('DATABASE_IS_AUTH')) {
        options.user = encodeURIComponent(
          configService.get<string>('DATABASE_USER')!,
        );
        options.pass = encodeURIComponent(
          configService.get<string>('DATABASE_PASSWORD')!,
        );
      }

      await mongoose.connect(connectionString, options).catch((error) => {
        console.info('Error while connecting to MongoDB database');
        console.error(error);
        process.exit(1);
      });

      if (configService.get<string>('NODE_ENV') === 'development') {
        mongoose.set('debug', true);
      }
      return mongoose;
    },
    inject: [ConfigService],
  },
];
