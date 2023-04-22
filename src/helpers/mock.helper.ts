import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { v4 as uuid } from "uuid";
import { generateRandomSecret } from "./secure.helper";

export type PrismaContext = {
  prisma: PrismaClient;
};
export type MockPrismaContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockPrismaContext = (): MockPrismaContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};
