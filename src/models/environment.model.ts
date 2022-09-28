import { IEnvironment } from "./interfaces/environment.interface";
import { IDatabaseConfig } from "./interfaces/orm-database-config.interface";
import { existsSync, read, readFileSync } from "fs";
import { generateKeys } from "../scripts/generate-keys.script";

export class Environment {
	constructor(public env: IEnvironment) {}

	async initialize(): Promise<void> {
		await this.generateKeyPairIfNeeded();
	}

	getDatabase(): IDatabaseConfig {
		return {
			username: this.env.DB_USER,
			hostname: this.env.DB_HOST,
			databaseName: this.env.DB_NAME,
			password: this.env.DB_PASS,
			port: this.env.DB_PORT,
			url: this.env.DB_URL,
		};
	}

	isDev(): boolean {
		return this.env.ENVIRONMENT === "dev";
	}

	async generateKeyPairIfNeeded(): Promise<void> {
		if (existsSync(this.env.JWT_KEY_PRIVATE) && existsSync(this.env.JWT_KEY_PUBLIC)) {
			return;
		}

		return generateKeys(this.env.JWT_KEY_PRIVATE, this.env.JWT_KEY_PUBLIC);
	}

	getJwkKeyPair(): { private: any; public: any } {
		return {
			private: JSON.parse(readFileSync(this.env.JWT_KEY_PRIVATE).toString()),
			public: JSON.parse(readFileSync(this.env.JWT_KEY_PUBLIC).toString()),
		};
	}
}
