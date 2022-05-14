import { JWT_SERVICE } from "../helpers/di-names.helper";
import { Inject } from "./dependency-provider.service";
import { JwtSessionService } from "./jwt-session.service";

export class BaseAuthService {
	@Inject<JwtSessionService>(JWT_SERVICE)
	jwtSessionService!: JwtSessionService;
}
