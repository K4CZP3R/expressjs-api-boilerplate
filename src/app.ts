import express from "express";
import helmet from "helmet";
import cors from "cors";

import { IController } from "./models/interfaces/controller.interface";
import { errorMiddleware } from "./middlewares/error.middleware";
import { DependencyProviderService } from "./services/dependency-provider.service";
import { JWT_SERVICE, PRISMA_SERVICE } from "./helpers/di-names.helper";
import { getEnvironment } from "./helpers/dotenv.helper";
import { JwtSessionService } from "./services/jwt-session.service";
import { AuthController } from "./controllers/auth.controller";
import { getDebug } from "./helpers/debug.helper";
import { IEnvironment } from "./models/interfaces/environment.interface";
import { PrismaClient } from "@prisma/client";
import { UserController } from "./controllers/user.controller";

export class App {
  public app: express.Express;

  private controllers: IController[] = [
    new AuthController(),
    new UserController(),
  ];
  debug: debug.Debugger;
  public appIsReady: boolean;

  constructor() {
    this.appIsReady = false;
    this.debug = getDebug();

    const environemnt = getEnvironment();

    this.debug("Initializing express app");
    this.app = express();

    this.bootstrapApp(environemnt)
      .then(() => {
        this.appIsReady = true;
        this.debug("App bootstrapped!");
      })
      .catch((e: unknown) => {
        console.error("Something went wrong while bootstrapping", e);
      });
  }

  private bootstrapApp(environment: IEnvironment): Promise<void> {
    this.setupDi(environment);
    this.setupMiddlewares();
    this.setupControllers();
    this.setupAfterMiddlewares();

    return Promise.resolve();
  }

  private setupDi(env: IEnvironment) {
    DependencyProviderService.setImpl<JwtSessionService>(
      JWT_SERVICE,
      new JwtSessionService({
        jwkEndpoint: env.JWKS_ENDPOINT,
        audience: env.JWK_AUDIENCE,
        scopes: env.JWK_SCOPES,
      })
    );

    DependencyProviderService.setImpl<PrismaClient>(
      PRISMA_SERVICE,
      new PrismaClient()
    );
  }

  private setupMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get("/", (req, res, next) => {
      next(new Error("Not implemented"));
    });
  }

  private setupControllers() {
    this.controllers.forEach(controller => {
      this.app.use(controller.path, controller.router);
    });
  }

  private setupAfterMiddlewares() {
    this.app.use(errorMiddleware);
  }
}
