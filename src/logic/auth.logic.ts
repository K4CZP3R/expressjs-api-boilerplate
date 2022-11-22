import { ApiKeyAuthService } from './../services/api-key-auth.service';
import { EmailAuthService } from './../services/email-auth.service';
import { checkValues } from "../helpers/type-checker.helper";
import { IResult } from "../models/interfaces/result.interface";
import { BaseAuthService } from "../services/base-auth.service";
import { IUser } from "../models/user.model";
import { IAuth } from "../models/auth.model";

export class AuthLogic {
	constructor(private emailAuth = new EmailAuthService(), private apiKeyAuth = new ApiKeyAuthService(), private baseAuth = new BaseAuthService()) { }
	async getJwks(): Promise<{ keys: any[] }> {
		return await this.baseAuth.getPublicJwtInfo();
	}

	async registerApiKey(data: {
		user: IUser
	}): Promise<IResult<string>> {
		checkValues(data, { shouldContainKeys: ["user"] });
		return await this.apiKeyAuth.register({ userId: data.user._id! });
	}

	async removeApiKey(data: { user: IUser; apiKey: string }): Promise<IResult<boolean>> {
		checkValues(data, { shouldContainKeys: ["user", "apiKey"] });
		return await this.apiKeyAuth.remove({ user: data.user, apiKey: data.apiKey });
	}



	async authenticateUsingEmail(data: {
		email: string;
		passwordEncoded: string;
	}): Promise<IResult<{ accessToken: string; refreshToken: string }>> {
		checkValues(data, { shouldContainKeys: ["email", "passwordEncoded"] });

		return await this.emailAuth.authenticate(data);
	}

	async meData(data: { user: IUser }): Promise<IResult<{ user: IUser; auths: IAuth[] }>> {
		return {
			success: true,
			data: { user: data.user, auths: await this.baseAuth.getAuthData({ userId: data.user._id! }) },
		};
	}

	async refreshToken(data: { user: IUser }): Promise<IResult<{ accessToken: string; refreshToken: string }>> {
		let newSession = await this.baseAuth.createSession({ user: data.user });
		return { success: true, data: { accessToken: newSession.accessToken, refreshToken: newSession.refreshToken } };
	}

	async registerUsingEmail(data: {
		email: string;
		passwordEncoded: string;
		username: string;
	}): Promise<IResult<string>> {
		checkValues(data, { shouldContainKeys: ["email", "passwordEncoded", "username"], checkRuleChangeableValues: true });
		return await this.emailAuth.register(data);
	}
}
