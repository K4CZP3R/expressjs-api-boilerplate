import { generateRandomSecret } from '../helpers/secure.helper';
import { IAuth } from '../models/auth.model';
import { AuthType } from '../models/enums/auth-type.enum';
import { IResult } from '../models/interfaces/result.interface';
import { IUser } from '../models/user.model';
import { BaseAuthService } from './base-auth.service';
export class ApiKeyAuthService extends BaseAuthService {
    constructor() {
        super();
    }

    async remove(data: { user: IUser; apiKey: string }): Promise<IResult<boolean>> {
        let auth = await this.authRepo.getByKey('uniqueData.apiKey', data.apiKey);
        if (!auth || auth.length === 0) {
            throw new Error("Api key is not valid!");
        }

        if (auth[0].forUser !== data.user._id) {
            throw new Error("Api key is not valid!");
        }

        await this.authRepo.removeById(auth[0]._id!);
        return {
            success: true
        }
    }

    async validate(data: {
        apiKey: string
    }): Promise<IResult<{ user: IUser }>> {
        let auth = await this.authRepo.getByKey('uniqueData.apiKey', data.apiKey);
        if (!auth || auth.length === 0) {
            throw new Error("Api key is not valid!");
        }

        let user = await this.getUser({ id: auth[0].forUser });
        if (!user) {
            throw new Error("User not found!");
        }

        return {
            success: true,
            message: "Authorized!",
            data: { user }
        }
    }



    async register(data: { userId: string }): Promise<IResult<string>> {
        let user = await this.getUser({ id: data.userId });

        let newAuth = await this.createApiKeyAuth({ user: user });

        return { success: true, message: "Registered!!", data: newAuth.uniqueData.apiKey };
    }


    private async createApiKeyAuth(data: { user: IUser }): Promise<IAuth> {
        let auth: IAuth = {
            forUser: data.user._id,
            authType: AuthType.API_KEY,
            uniqueData: {
                apiKey: generateRandomSecret(64)
            }
        }

        return await this.authRepo.addObject(auth);
    }


}