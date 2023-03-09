import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      secret: 'dda80fHOP97sLF9fpjNHnwroK2nsanf90ni930ti3',
      name: 'daofhakldkdadkadkafnlqqgfpepk2ptahpafapdjapdalssk',
      resave: false,
      saveUninitialized: true,
      rolling: true,
      cookie: {
        // secure: true,
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365 * 1000,
        sameSite: 'lax',
      },
    }),
  );
  await app.listen(3005);
}
bootstrap();
