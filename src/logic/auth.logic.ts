import { checkValues } from "../helpers/type-checker.helper";
import { IResult } from "../models/interfaces/result.interface";
import { BaseAuthService } from "../services/base-auth.service";
import { IUser } from "../models/user.model";

export class AuthLogic {
	constructor(private baseAuth = new BaseAuthService()) {}

	async meData(data: { user: IUser }): Promise<IResult<{ user: IUser }>> {
		return { success: true, data: { user: data.user } };
	}
}
