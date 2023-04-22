import { PrismaClient } from "@prisma/client";
import { PRISMA_SERVICE } from "../helpers/di-names.helper";
import { Inject } from "../services/dependency-provider.service";

export interface CurrentContext {
  profileId?: string;
  userId?: string | undefined;
}

export type ProfileContext = CurrentContext & {
  profileId: string;
};

export type UserContext = CurrentContext & {
  userId: string;
};

export class BaseRepo {
  protected currentContext?: CurrentContext;

  @Inject<PrismaClient>(PRISMA_SERVICE)
  prisma!: PrismaClient;

  constructor(context?: CurrentContext) {
    this.currentContext = context;
  }
}
