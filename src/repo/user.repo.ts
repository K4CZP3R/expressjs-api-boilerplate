import { User } from "@prisma/client";
import { ErrorCode } from "../helpers/error-codes.helper";
import { HttpException } from "../models/exceptions/http.exception";
import { BaseRepo } from "./base.repo";

export class UserRepo extends BaseRepo {
  async getUser(userId: string): Promise<User> {
    await this.contextAllowedToReadUser({ userId });
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user === null) throw new HttpException(ErrorCode.UserNotFound);
    return user;
  }

  private contextAllowedToReadUser(d: { userId: string }): Promise<void> {
    if (!this.currentContext?.userId) {
      throw new HttpException(ErrorCode.MissingContextUserId);
    }

    if (this.currentContext.userId !== d.userId) {
      throw new HttpException(ErrorCode.NoRights);
    }

    return Promise.resolve();
  }
}
