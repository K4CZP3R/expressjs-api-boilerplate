import { AuthModel, IAuth } from "../models/auth.model";
import { BaseRepository } from "./base.repository";
export class AuthRepository extends BaseRepository<IAuth> {
	constructor() {
		super(AuthModel);
	}
}