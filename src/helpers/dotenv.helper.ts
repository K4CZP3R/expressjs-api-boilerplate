import * as dotenv from "dotenv";
import {
  environmentSchema,
  IEnvironment,
  IEnvironmentKeys,
  IRawEnvironment,
} from "../models/interfaces/environment.interface";
import _ from "lodash";

dotenv.config();

export function getRawEnvironment(): IRawEnvironment {
  return _.pick(
    process.env,
    Object.keys(IEnvironmentKeys)
  ) as unknown as IRawEnvironment;
}

export function getEnvironment(): IEnvironment {
  return environmentSchema.parse(getRawEnvironment());
}
