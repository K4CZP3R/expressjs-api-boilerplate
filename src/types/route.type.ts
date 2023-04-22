import { IResult } from "../models/interfaces/result.interface";
import { ISession } from "../models/interfaces/session.interface";

export type RouteFunction = (data: RouteData) => Promise<IResult<unknown>>;

export type RouteData = {
  query: { [key: string]: string };
  params: { [key: string]: string };
  body: { [key: string]: unknown };
  session: ISession;
};
