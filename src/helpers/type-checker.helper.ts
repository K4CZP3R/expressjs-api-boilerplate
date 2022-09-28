import { IResult } from "../models/interfaces/result.interface";
import { isAllowedUsername, isValidEmail, isValidUUID } from "./input-validator.helper";
import { isStrongEncodedPassword, isStrongPassword } from "./password.helper";

export function anyIsArray(input: any) {
	return Array.isArray(input);
}
export function anyIsType(input: any, type: string) {
	return typeof input === type;
}

export function anysAreType(input: any[], type: string) {
	return input.every(i => typeof i === type);
}

export function pathContainsKey(dataIn: any, key: string): boolean {
	let keyPath = key.split(".");
	if (
		Object.keys(dataIn).indexOf(keyPath[0]) === -1 &&
		(dataIn[keyPath[0]] === undefined || dataIn[keyPath[0]] === null)
	) {
		return false;
	}
	if (keyPath.length === 1) {
		return true;
	}
	return keyPath.length === 1 ? true : pathContainsKey(dataIn[keyPath[0]], keyPath.slice(1).join("."));
}

export function checkValues(
	dataIn: any,
	config?: { shouldContainKeys?: string[]; checkRuleChangeableValues?: boolean }
) {
	let shouldContainKeys = config && config.shouldContainKeys ? config.shouldContainKeys : [];
	let checkRuleChangeableValues = config && config.checkRuleChangeableValues ? config.checkRuleChangeableValues : false;

	shouldContainKeys.forEach(shouldKey => {
		if (!pathContainsKey(dataIn, shouldKey)) {
			throw new Error(`${shouldKey} is missing from ${JSON.stringify(dataIn)}`);
		}
	});

	Object.keys(dataIn).forEach(key => {
		let result: IResult<undefined> | undefined = undefined;
		switch (key.toLowerCase()) {
			case "email":
				result = dataIn[key] ? isValidEmail(dataIn[key]) : { success: false, message: "Invalid data (email)" };
				break;
			case "passwordencoded":
				if (checkRuleChangeableValues) {
					result = dataIn[key]
						? isStrongEncodedPassword(dataIn[key])
						: { success: false, message: "Invalid data (password)" };
				}
				break;
			case "password":
				if (checkRuleChangeableValues) {
					result = dataIn[key] ? isStrongPassword(dataIn[key]) : { success: false, message: "Invalid data (password)" };
				}
				break;
			case "username":
				if (checkRuleChangeableValues) {
					result = dataIn[key]
						? isAllowedUsername(dataIn[key])
						: { success: false, message: "Invalid data (username)" };
				}
				break;

			default:
				if (key.toLowerCase().includes("ids")) {
					if (anyIsArray(dataIn[key])) {
						for (let id of dataIn[key]) {
							const subResult = isValidUUID(id);
							if (result === undefined || result.success) {
								result = subResult;
							}
						}
					} else {
						dataIn[key].split(",").forEach((id: string) => {
							const subResult = isValidUUID(id);
							if (result === undefined || result.success) {
								result = subResult;
							}
						});
					}
				} else if (key.toLowerCase().includes("id")) {
					result = dataIn[key] ? isValidUUID(dataIn[key]) : { success: false, message: "Invalid data (id)" };
				}
				// if (key.toLowerCase().includes("name")) {
				// 	result = dataIn[key] ? isAllowedUsername(dataIn[key]) : { success: false, message: "Invalid data (name)" };
				// }
				break;
		}
		if (result === undefined) {
			return;
		}
		if (!result.success) {
			//TODO: Something wrong with uuid check
			throw new Error(result.message);
		}
		return;
	});
}
