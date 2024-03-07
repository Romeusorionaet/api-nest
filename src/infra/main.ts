import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { Env } from "./env/env";
import { EnvService } from "./env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // loger: false
  });

  const envService = app.get<ConfigService<Env, true>>(EnvService);
  const port = envService.get("PORT");

  await app.listen(port);
}

bootstrap();
