import { User } from "@prisma/client";
import { UserRepo } from "../repo/user.repo";

export class UserLogic {
  getMe(userId: string): Promise<User> {
    return new UserRepo({ userId }).getUser(userId);
  }
}
