export interface ClientSettings {
	port: number;
	ip: string;
}

export interface WrapperSettings extends ClientSettings {
	cmd: string;
}

export interface BotSettings extends ClientSettings {
	token: string;
	chatID: string;
	allowList: true;
	localAuth: boolean;
	postUpdates: boolean;
}

export interface BotWrapperSettings {
	cmd: string;
	token: string;
	chatID: string;
	allowList: true;
	localAuth: boolean;
	postUpdates: boolean;
}

export type Settings = ClientSettings | WrapperSettings | BotSettings | BotWrapperSettings;
