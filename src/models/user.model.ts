import { Schema, model, models } from "mongoose";
import { randomUuid } from "../helpers/mongo.helper";
import { AccountType } from "./enums/account-type.enum";

export interface IUser {
	_id?: string;
	accountType?: string;
	name: string;
	displayName: string;
}

const schema = new Schema<IUser>(
	{
		_id: randomUuid,
		accountType: { type: String, default: AccountType.USER },
		name: { type: String, unique: true },
		displayName: {type:String}
	},
	{ timestamps: true }
);

export const UserModel = models.User || model<IUser>("User", schema);
