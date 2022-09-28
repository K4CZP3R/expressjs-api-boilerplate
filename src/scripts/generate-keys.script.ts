import { triggerAsyncId } from "async_hooks";
import { constants, existsSync } from "fs";
import { writeFile } from "fs/promises";

import * as jose from "jose";

export async function generateKeys(privatePath: string, publicPath: string): Promise<void> {
	const { publicKey, privateKey } = await jose.generateKeyPair("RS512");

	const publicJwk = await jose.exportJWK(publicKey);
	const privateJwk = await jose.exportJWK(privateKey);

	await writeFile(publicPath, JSON.stringify(publicJwk, null, 2));
	await writeFile(privatePath, JSON.stringify(privateJwk, null, 2));
	console.log("Generated!");
	Promise.resolve();
}
