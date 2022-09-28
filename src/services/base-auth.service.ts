import { JWT_SERVICE } from "../helpers/di-names.helper";
import { IUser } from "../models/user.model";
import { AuthRepository } from "../repositories/auth.repository";
import { Inject } from "./dependency-provider.service";
import { JwtSessionService } from "./jwt-session.service";
import { UserRepository } from "../repositories/user.repository";
import { IAuth } from "../models/auth.model";

export class BaseAuthService {
	@Inject<JwtSessionService>(JWT_SERVICE)
	jwtSessionService!: JwtSessionService;

	constructor(public authRepo: AuthRepository = new AuthRepository(), public userRepository = new UserRepository()) { }

	async createUser(data: { name: string }): Promise<IUser> {
		if ((await this.userRepository.getAllByKey("name", data.name)).length > 0) {
			throw new Error("User already exists");
		}
		return await this.userRepository.addObject({
			name: data.name,
			displayName: data.name,
		});
	}

	async updateUser(data: { user: IUser }): Promise<IUser> {
		return await this.userRepository.update(data.user._id, data.user);
	}

	async getUser(data: { id: string }): Promise<IUser> {
		return await this.userRepository.getById(data.id);
	}

	async getAuthData(data: { userId: string }): Promise<IAuth> {

		let auth = await this.authRepo.getByKey("forUser", data.userId);
		if (!auth) {
			throw new Error("Auth not found");
		}

		delete auth.uniqueData.emailPwHash;
		// filter out private data

		return auth;
	}

	async createSession(data: { user: IUser }): Promise<{ accessToken: string; refreshToken: string }> {
		return {
			accessToken: await this.jwtSessionService.signSession({ id: data.user._id, type: "user", user: data.user }),
			refreshToken: await this.jwtSessionService.signRefresh({ id: data.user._id, type: "refresh", user: data.user }),
		};
	}

	async getPublicJwtInfo(): Promise<{ keys: any[] }> {
		return {
			keys: [await this.jwtSessionService.getPublicJwk()],
		};
	}
}
