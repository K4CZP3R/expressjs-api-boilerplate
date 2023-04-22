import { UserLogic } from "../logic/user.logic";
import { authJwtMiddleware } from "../middlewares/auth.middleware";
import { IResult } from "../models/interfaces/result.interface";
import { RouteData } from "../types/route.type";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
  constructor(private userLogic = new UserLogic()) {
    super("/user");

    this.initialize(
      [
        {
          path: "/",
          method: "get",
          func: this.getMeEndpoint.bind(this),
        },
      ],
      [authJwtMiddleware]
    );
  }

  async getMeEndpoint(data: RouteData): Promise<IResult<unknown>> {
    return {
      data: await this.userLogic.getMe(data.session.userId),
    };
  }
}
