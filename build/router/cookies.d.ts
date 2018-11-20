interface Cookies {
    secure: boolean;
    get(name: string, opts?: GetOption): string;
    set(name: string, value?: string, opts?: SetOption): Cookies;
}
interface GetOption {
    signed: boolean;
}
interface SetOption {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    secureProxy?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | boolean;
    signed?: boolean;
    overwrite?: boolean;
}
export { Cookies, GetOption, SetOption };
