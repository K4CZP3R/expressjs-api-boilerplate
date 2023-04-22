import { PrismaClient, User } from "@prisma/client";
import {
  MockPrismaContext,
  createMockPrismaContext,
  PrismaContext,
} from "../helpers/mock.helper";
import { DependencyProviderService } from "../services/dependency-provider.service";
import { PRISMA_SERVICE } from "../helpers/di-names.helper";
import { v4 as uuid } from "uuid";
import { UserRepo } from "../repo/user.repo";
import { HttpException } from "../models/exceptions/http.exception";
import { ErrorCode } from "../helpers/error-codes.helper";

describe(__filename.split(/[/]/).pop() ?? "", () => {
  let mockCtx: MockPrismaContext;
  let ctx: PrismaContext;

  beforeEach(() => {
    mockCtx = createMockPrismaContext();
    ctx = mockCtx as unknown as PrismaContext;
    DependencyProviderService.setImpl<PrismaClient>(PRISMA_SERVICE, ctx.prisma);
  });
  it("Owner can read their own user object.", async () => {
    const user = {
      id: uuid(),
    } as User;

    const userId = uuid();
    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    const rUser = await new UserRepo({ userId }).getUser(userId);
    expect(rUser).toEqual(user);
  });

  it("Someone else can't read someone's else user object.", () => {
    const user = {
      id: uuid(),
    } as User;

    const userId = uuid();
    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    expect(async () => {
      await new UserRepo({ userId: uuid() }).getUser(userId);
    }).rejects.toThrow(new HttpException(ErrorCode.NoRights));
  });

  it("No user id in context throws an error.", () => {
    const user = {
      id: uuid(),
    } as User;

    const userId = uuid();
    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    expect(async () => {
      await new UserRepo().getUser(userId);
    }).rejects.toThrow(new HttpException(ErrorCode.MissingContextUserId));
  });

  it("No user found throws an error.", () => {
    const userId = uuid();
    mockCtx.prisma.user.findUnique.mockResolvedValue(null);
    expect(async () => {
      await new UserRepo({ userId }).getUser(userId);
    }).rejects.toThrow(new HttpException(ErrorCode.UserNotFound));
  });
});
